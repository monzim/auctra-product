'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, FormEvent } from "react";

interface CompanyHistoryRecord {
    ipfs_hash: string;
    verification_timestamp: string; // Keep as string for simplicity
    previous_hash: string;
}

export default function HistorySearchPage() {
    const [companyId, setCompanyId] = useState('');
    const [history, setHistory] = useState<CompanyHistoryRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setHistory([]);
        setSearched(true);

        try {
            const response = await fetch(`/api/admin/history?companyId=${companyId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch history.');
            }

            setHistory(data.history);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 space-y-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Search Company History</CardTitle>
                    <CardDescription>Enter a Company ID to view its on-chain verification history.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <Label htmlFor="companyId" className="sr-only">Company ID</Label>
                        <Input
                            id="companyId"
                            value={companyId}
                            onChange={(e) => setCompanyId(e.target.value)}
                            placeholder="Enter Company ID"
                            required
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Searching...' : 'Search'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {searched && !isLoading && history.length > 0 && (
                 <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle>On-Chain History for {companyId}</CardTitle>
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

            {searched && !isLoading && history.length === 0 && !error && (
                <p className="text-center text-muted-foreground">No history found for this Company ID.</p>
            )}
        </div>
    );
}
