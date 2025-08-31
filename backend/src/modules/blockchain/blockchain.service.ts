import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.Provider;
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor() {
    this.initializeBlockchain();
  }

  private async initializeBlockchain() {
    try {
      this.provider = new ethers.JsonRpcProvider('http://localhost:8545');
      
      const contractPath = path.join(process.cwd(), '../src/contracts/AuctraTender.json');
      if (!fs.existsSync(contractPath)) {
        this.logger.warn('Contract file not found. Please deploy the contract first.');
        return;
      }

      const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
      
      try {
        // In ethers v6, we need to create a wallet or use a different approach for signers
        // For development, we'll use a default private key or skip signer initialization
        this.logger.log('Signer initialization skipped - will use provider only');
      } catch (error) {
        this.logger.warn('No signer available, using provider only');
      }

      this.contract = new ethers.Contract(
        contractData.address,
        contractData.abi,
        this.signer || this.provider
      );

      this.logger.log('Blockchain service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize blockchain service:', error);
    }
  }

  async getContract(): Promise<ethers.Contract> {
    if (!this.contract) {
      await this.initializeBlockchain();
    }
    return this.contract;
  }

  async getProvider(): Promise<ethers.Provider> {
    return this.provider;
  }

  async getSigner(): Promise<ethers.Signer> {
    return this.signer;
  }

  async getBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      this.logger.error('Error getting block number:', error);
      throw new Error('Unable to connect to blockchain');
    }
  }

  async getTransactionReceipt(txHash: string): Promise<ethers.TransactionReceipt | null> {
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      this.logger.error('Error getting transaction receipt:', error);
      return null;
    }
  }
}