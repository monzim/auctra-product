'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBlockchain } from '@/hooks/useBlockchain';
import { TenderData } from '@/lib/blockchain';
import { Calendar, DollarSign, Building2 } from 'lucide-react';

export const TenderList = ({ onSelectTender }: { onSelectTender?: (tender: TenderData) => void }) => {
  const [tenders, setTenders] = useState<TenderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getAllTenders, formatTimestamp } = useBlockchain();

  const loadTenders = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTenders = await getAllTenders();
      setTenders(fetchedTenders);
    } catch (error: any) {
      setError('Failed to load tenders');
      console.error('Error loading tenders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenders();
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isExpired = (deadline: string) => {
    return new Date(parseInt(deadline) * 1000) < new Date();
  };

  const getStatusBadge = (tender: TenderData) => {
    if (tender.isAwarded) {
      return <Badge variant="secondary">Awarded</Badge>;
    }
    if (!tender.isActive || isExpired(tender.deadline)) {
      return <Badge variant="outline">Closed</Badge>;
    }
    return <Badge className="bg-green-500">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadTenders}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tenders.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No tenders found</p>
            <Button onClick={loadTenders}>Refresh</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Tenders</h2>
        <Button onClick={loadTenders} variant="outline">
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tenders.map((tender) => (
          <Card key={tender.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {tender.title}
                </CardTitle>
                {getStatusBadge(tender)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {tender.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">{tender.budget} ETH</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {formatTimestamp(tender.deadline)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4" />
                  <span>Gov: {formatAddress(tender.government)}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  onClick={() => onSelectTender?.(tender)}
                  className="w-full"
                  disabled={tender.isAwarded || (!tender.isActive || isExpired(tender.deadline))}
                >
                  {tender.isAwarded ? 'Awarded' : 
                   (!tender.isActive || isExpired(tender.deadline)) ? 'Closed' : 'View Details'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};