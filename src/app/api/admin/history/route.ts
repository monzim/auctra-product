import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import contractConfig from '@/lib/blockchain/contract-config.json';

interface CompanyHistoryRecord {
    ipfs_hash: string;
    verification_timestamp: bigint;
    previous_hash: string;
}

async function getCompanyHistory(companyId: string): Promise<any[]> {
    if (!contractConfig.address) {
        throw new Error("Contract address is not configured.");
    }
    try {
        const provider = new ethers.JsonRpcProvider("http://ganache:8545");
        const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, provider);
        const history: CompanyHistoryRecord[] = await contract.getCompanyHistory(companyId);

        // Convert BigInt to string for JSON serialization
        return history.map(record => ({
            ...record,
            verification_timestamp: record.verification_timestamp.toString(),
        }));
    } catch (error) {
        console.error(`Failed to fetch history for ${companyId}:`, error);
        throw new Error("Could not fetch company history from the blockchain.");
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
        return NextResponse.json({ message: 'Company ID is required' }, { status: 400 });
    }

    try {
        const history = await getCompanyHistory(companyId);
        return NextResponse.json({ history }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
