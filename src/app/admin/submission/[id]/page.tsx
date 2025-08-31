import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import fs from 'fs/promises';
import path from 'path';
import Link from "next/link";
import { notFound } from "next/navigation";
import VerificationActions from "./VerificationActions";
import { ethers } from 'ethers';
import contractConfig from '@/lib/blockchain/contract-config.json';

// --- Data Types ---
interface Submission {
    id: string;
    companyId: string;
    name: string;
    registrationNumber: string;
    contact: string;
    documentPath: string;
    submittedAt: string;
}

interface CompanyHistoryRecord {
    ipfs_hash: string;
    verification_timestamp: bigint;
    previous_hash: string;
}

// --- Data Fetching ---
async function getSubmission(id: string): Promise<Submission | null> {
    const dbPath = path.join(process.cwd(), 'db', 'pending.json');
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        const submissions: Submission[] = JSON.parse(data);
        return submissions.find(s => s.id === id) || null;
    } catch { return null; }
}

async function getCompanyHistory(companyId: string): Promise<CompanyHistoryRecord[]> {
    if (!contractConfig.address) return [];
    try {
        const provider = new ethers.JsonRpcProvider("http://ganache:8545");
        const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, provider);
        const history = await contract.getCompanyHistory(companyId);

        // The contract returns an array of structs. We need to format it.
        return history.map((record: any) => ({
            ipfs_hash: record.ipfs_hash,
            verification_timestamp: record.verification_timestamp,
            previous_hash: record.previous_hash,
        }));
    } catch (error) {
        console.error("Failed to fetch company history from blockchain:", error);
        return [];
    }
}

// --- Page Component ---
export default async function SubmissionDetailPage({ params }: { params: { id: string } }) {
    const submission = await getSubmission(params.id);
    if (!submission) {
        notFound();
    }

    const history = await getCompanyHistory(submission.companyId);

    return (
        <div className="container mx-auto px-4 py-12 space-y-8">
            {/* Submission Details Card */}
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Submission Details</CardTitle>
                    <CardDescription>Reviewing submission for: <strong>{submission.companyId}</strong></CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-muted-foreground">Company Name</p>
                            <p>{submission.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground">Registration Number</p>
                            <p>{submission.registrationNumber}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground">Contact Info</p>
                            <p className="whitespace-pre-wrap">{submission.contact}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground">Submitted At</p>
                            <p>{new Date(submission.submittedAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground">Supporting Document</p>
                            <Link href={submission.documentPath} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                View Document
                            </Link>
                        </div>
                    </div>

                    <VerificationActions submissionId={submission.id} />
                </CardContent>
            </Card>

            {/* Company History Card */}
            {history.length > 0 && (
                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle>On-Chain Version History</CardTitle>
                        <CardDescription>Immutable record of verified submissions for this company.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Version</TableHead>
                                    <TableHead>IPFS Hash</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Previous Hash</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((record, index) => (
                                    <TableRow key={index}>
                                        <TableCell>v{index + 1}</TableCell>
                                        <TableCell className="font-mono text-xs truncate" title={record.ipfs_hash}>{record.ipfs_hash}</TableCell>
                                        <TableCell>{new Date(Number(record.verification_timestamp) * 1000).toLocaleString()}</TableCell>
                                        <TableCell className="font-mono text-xs truncate" title={record.previous_hash}>{record.previous_hash || 'N/A'}</TableCell>
                                    </TableRow>
                                )).reverse()}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
