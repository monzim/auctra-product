import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import fs from 'fs/promises';
import path from 'path';
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface Submission {
    id: string;
    companyId: string;
    name: string;
    submittedAt: string;
    status: 'pending';
}

async function getPendingSubmissions(): Promise<Submission[]> {
    const dbPath = path.join(process.cwd(), 'db', 'pending.json');
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist or there's an error, return an empty array
        console.log("No pending submissions file found. Returning empty array.");
        return [];
    }
}

export default async function AdminDashboardPage() {
    const submissions = await getPendingSubmissions();

    return (
        <div className="container mx-auto px-4 py-12">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                    <CardDescription>Review and process pending company submissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {submissions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company ID</TableHead>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Submitted At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium">{submission.companyId}</TableCell>
                                        <TableCell>{submission.name}</TableCell>
                                        <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href={`/admin/submission/${submission.id}`}
                                                className={buttonVariants({ variant: "outline" })}
                                            >
                                                View Details
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">There are no pending submissions.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Revalidate this page every 10 seconds to show new submissions
export const revalidate = 10;
