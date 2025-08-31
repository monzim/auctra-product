'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerificationActions({ submissionId }: { submissionId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionInput, setShowRejectionInput] = useState(false);
    const router = useRouter();

    const handleVerify = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId, status: 'verified' }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Verification failed');
            }

            alert('Submission successfully verified!');
            router.push('/admin');
            router.refresh(); // Force a refresh of the admin page data
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason) {
            setError("A reason for rejection is required.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId, status: 'rejected', reason: rejectionReason }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Rejection failed');
            }

            alert('Submission successfully rejected.');
            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border-t pt-6 mt-6 space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}

            {showRejectionInput ? (
                <div className="space-y-2">
                    <label htmlFor="rejectionReason" className="font-semibold">Reason for Rejection</label>
                    <Textarea
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a clear reason for rejecting this submission..."
                    />
                    <div className="flex gap-4">
                        <Button onClick={handleReject} disabled={isLoading} variant="destructive" className="w-full">
                            {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
                        </Button>
                         <Button onClick={() => setShowRejectionInput(false)} variant="outline" className="w-full">
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4">
                    <Button onClick={handleVerify} disabled={isLoading} className="w-full">
                        {isLoading ? 'Verifying...' : 'Approve Submission'}
                    </Button>
                    <Button onClick={() => setShowRejectionInput(true)} disabled={isLoading} variant="destructive" className="w-full">
                        Reject Submission
                    </Button>
                </div>
            )}
        </div>
    );
}
