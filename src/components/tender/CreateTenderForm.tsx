'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlockchain } from '@/hooks/useBlockchain';

export const CreateTenderForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { createTender, isConnected, connectWallet } = useBlockchain();

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

      const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
      
      const result = await createTender(
        formData.title,
        formData.description,
        formData.budget,
        deadlineTimestamp
      );

      if (result.success) {
        setSuccess(`Tender created successfully! Transaction: ${result.transactionHash}`);
        setFormData({ title: '', description: '', budget: '', deadline: '' });
        onSuccess?.();
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create tender');
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

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create New Tender</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Tender Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter tender title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed description of the tender"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget (ETH)</Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter budget amount in ETH"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              min={minDateString}
              value={formData.deadline}
              onChange={handleChange}
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Creating Tender...' : isConnected ? 'Create Tender' : 'Connect Wallet'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};