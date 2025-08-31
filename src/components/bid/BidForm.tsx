'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlockchain } from '@/hooks/useBlockchain';
import { TenderData } from '@/lib/blockchain';

interface BidFormProps {
  tender: TenderData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const BidForm = ({ tender, onSuccess, onCancel }: BidFormProps) => {
  const [formData, setFormData] = useState({
    contractorName: '',
    bidAmount: '',
    proposal: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { submitBid, isConnected, connectWallet } = useBlockchain();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!isConnected) {
        await connectWallet();
        return;
      }

      const result = await submitBid(
        tender.id,
        formData.contractorName,
        formData.bidAmount,
        formData.proposal
      );

      if (result.success) {
        setSuccess(`Bid submitted successfully! Transaction: ${result.transactionHash}`);
        setFormData({ contractorName: '', bidAmount: '', proposal: '' });
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to submit bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const maxBid = parseFloat(tender.budget) * 0.9;

  return (
    <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
      {/* Tender Details */}
      <Card>
        <CardHeader>
          <CardTitle>Tender Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{tender.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{tender.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Budget:</span>
              <p className="font-medium">{tender.budget} ETH</p>
            </div>
            
            <div>
              <span className="text-gray-500">Deadline:</span>
              <p className="font-medium">{new Date(parseInt(tender.deadline) * 1000).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div>
            <span className="text-gray-500">Government Address:</span>
            <p className="font-mono text-xs break-all">{tender.government}</p>
          </div>
        </CardContent>
      </Card>

      {/* Bid Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Bid</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contractorName">Company/Contractor Name</Label>
              <Input
                id="contractorName"
                name="contractorName"
                value={formData.contractorName}
                onChange={handleChange}
                placeholder="Enter your company name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bidAmount">Bid Amount (ETH)</Label>
              <Input
                id="bidAmount"
                name="bidAmount"
                type="number"
                step="0.01"
                min="0.01"
                max={maxBid}
                value={formData.bidAmount}
                onChange={handleChange}
                placeholder={`Enter bid amount (max: ${maxBid.toFixed(2)} ETH)`}
                required
              />
              <p className="text-xs text-gray-500">
                Recommended: Below {maxBid.toFixed(2)} ETH (90% of budget)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposal">Proposal</Label>
              <Textarea
                id="proposal"
                name="proposal"
                value={formData.proposal}
                onChange={handleChange}
                placeholder="Describe your proposal, timeline, and qualifications"
                rows={4}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting Bid...' : isConnected ? 'Submit Bid' : 'Connect Wallet'}
              </Button>
              
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};