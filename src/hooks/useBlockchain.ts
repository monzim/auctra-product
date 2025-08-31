'use client';

import { useState, useEffect, useCallback } from 'react';
import { blockchainService, TenderData, BidData } from '@/lib/blockchain';

export const useBlockchain = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeBlockchain = async () => {
      try {
        const initialized = await blockchainService.initialize();
        setIsInitialized(initialized);
        
        if (initialized) {
          setIsConnected(blockchainService.isWalletConnected());
        }
      } catch (error) {
        console.error('Failed to initialize blockchain:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeBlockchain();
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      const address = await blockchainService.connectWallet();
      if (address) {
        setWalletAddress(address);
        setIsConnected(true);
        return address;
      }
      return null;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    }
  }, []);

  const createTender = useCallback(async (
    title: string, 
    description: string, 
    budget: string, 
    deadline: number
  ) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    return await blockchainService.createTender(title, description, budget, deadline);
  }, [isConnected]);

  const submitBid = useCallback(async (
    tenderId: string,
    contractorName: string,
    bidAmount: string,
    proposal: string
  ) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    return await blockchainService.submitBid(tenderId, contractorName, bidAmount, proposal);
  }, [isConnected]);

  const getAllTenders = useCallback(async (): Promise<TenderData[]> => {
    return await blockchainService.getAllTenders();
  }, []);

  const getTenderBids = useCallback(async (tenderId: string): Promise<BidData[]> => {
    return await blockchainService.getTenderBids(tenderId);
  }, []);

  return {
    isInitialized,
    isConnected,
    walletAddress,
    loading,
    connectWallet,
    createTender,
    submitBid,
    getAllTenders,
    getTenderBids,
    formatTimestamp: blockchainService.formatTimestamp,
    contractAddress: blockchainService.getContractAddress(),
  };
};