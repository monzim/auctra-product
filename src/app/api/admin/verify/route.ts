import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import contractConfig from '@/lib/blockchain/contract-config.json';

// Define the structure of a submission
interface Submission {
    id: string;
    companyId: string;
    name: string;
    registrationNumber: string;
    contact: string;
    documentPath: string; // Relative path like /uploads/file.pdf
    submittedAt: string;
}

// --- Database Helpers ---
const dbDir = path.join(process.cwd(), 'db');
const pendingDbPath = path.join(dbDir, 'pending.json');
const verifiedDbPath = path.join(dbDir, 'verified.json');
const rejectedDbPath = path.join(dbDir, 'rejected.json');

const readDb = async (filePath: string): Promise<any[]> => {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch { return []; }
};

const writeDb = async (filePath: string, data: any[]) => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// --- Blockchain and IPFS Setup ---
if (!process.env.ADMIN_PRIVATE_KEY) {
    throw new Error("ADMIN_PRIVATE_KEY environment variable is not set.");
}
const ipfs = create({ host: 'ipfs', port: 5001, protocol: 'http' });
const provider = new ethers.JsonRpcProvider("http://ganache:8545");
const signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
const companyRegistryContract = new ethers.Contract(contractConfig.address, contractConfig.abi, signer);


export async function POST(req: NextRequest) {
    // Ensure all DB files exist before proceeding
    await Promise.all([
        writeDb(pendingDbPath, await readDb(pendingDbPath)),
        writeDb(verifiedDbPath, await readDb(verifiedDbPath)),
        writeDb(rejectedDbPath, await readDb(rejectedDbPath)),
    ]);

    const { submissionId, status, reason } = await req.json();

    if (!submissionId || !status || (status === 'rejected' && !reason)) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const pendingSubmissions = await readDb(pendingDbPath);
    const submissionIndex = pendingSubmissions.findIndex(s => s.id === submissionId);

    if (submissionIndex === -1) {
        return NextResponse.json({ message: 'Submission not found in pending list' }, { status: 404 });
    }

    const submission: Submission = pendingSubmissions[submissionIndex];

    if (status === 'rejected') {
        // --- Rejection Logic ---
        const [rejectedSubmission] = pendingSubmissions.splice(submissionIndex, 1);
        const rejectedSubmissionsDb = await readDb(rejectedDbPath);
        const rejectedRecord = { ...rejectedSubmission, status: 'rejected', reason, rejectedAt: new Date().toISOString() };
        rejectedSubmissionsDb.push(rejectedRecord);

        await writeDb(pendingDbPath, pendingSubmissions);
        await writeDb(rejectedDbPath, rejectedSubmissionsDb);

        return NextResponse.json({ message: 'Submission rejected successfully' }, { status: 200 });
    }

    if (status === 'verified') {
        // --- Atomic Verification Logic ---
        try {
            // 1. Upload document to IPFS
            const filePath = path.join(process.cwd(), 'public', submission.documentPath);
            const fileContent = await fs.readFile(filePath);
            const { cid: ipfsHash } = await ipfs.add(fileContent);

            // 2. Commit record to blockchain
            const tx = await companyRegistryContract.addRecord(
                submission.companyId,
                submission.name,
                submission.registrationNumber,
                submission.contact,
                ipfsHash.toString(),
                'verified'
            );
            const receipt = await tx.wait();

            // 3. If both succeed, update the database atomically
            const [verifiedSubmission] = pendingSubmissions.splice(submissionIndex, 1);
            const verifiedRecord = {
                ...verifiedSubmission,
                status: 'verified',
                verifiedAt: new Date().toISOString(),
                ipfsHash: ipfsHash.toString(),
                transactionHash: receipt.hash,
            };
            const verifiedSubmissionsDb = await readDb(verifiedDbPath);
            verifiedSubmissionsDb.push(verifiedRecord);

            await writeDb(verifiedDbPath, verifiedSubmissionsDb);
            await writeDb(pendingDbPath, pendingSubmissions);

            return NextResponse.json({ message: `Submission verified successfully`, ipfsHash: ipfsHash.toString(), transactionHash: receipt.hash }, { status: 200 });

        } catch (error: any) {
            console.error('--- ATOMIC VERIFICATION FAILED ---', error);
            return NextResponse.json({ message: `Verification failed: ${error.message}` }, { status: 500 });
        }
    }

    return NextResponse.json({ message: 'Invalid status provided' }, { status: 400 });
}
