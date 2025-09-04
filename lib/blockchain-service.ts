import { ethers } from "ethers";
import { CryptoService, TransactionData } from "./crypto-utils";

export interface ProductPricingEntry {
  productName: string;
  category: string;
  description: string;
  price: number;
  specifications: Record<string, any>;
  companyAddress: string;
  timestamp: string;
  signature: string;
  previousTransactionHash?: string;
}

export interface BlockchainTransaction {
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  gasUsed: bigint;
  status: number;
  timestamp: string;
}

export class BlockchainService {
  private provider: ethers.Provider | null = null;
  private wallet: ethers.Wallet | null = null;
  private useMockMode = false;

  constructor() {
    // Always try to connect to local Ganache blockchain
    this.provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    // Use the first account from Ganache for contract operations
    const privateKey =
      "0x1ab42cc412b618bdea3a599e3c9bae199ebf030895b039e9db1e30dafb12b727";
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.useMockMode = false; // Force real blockchain usage
  }

  async addProductPricing(
    entry: ProductPricingEntry
  ): Promise<BlockchainTransaction> {
    if (!this.provider || !this.wallet) {
      throw new Error("Blockchain provider not initialized");
    }

    try {
      // Test connection first
      const network = await this.provider.getNetwork();
      console.log(`[blockchain] Connected to network: ${network.name} (chainId: ${network.chainId})`);

      // Create transaction data
      const transactionData: TransactionData = {
        productName: entry.productName,
        price: entry.price,
        timestamp: entry.timestamp,
        companyAddress: entry.companyAddress,
        previousTransactionHash: entry.previousTransactionHash,
      };

      // Convert entry to hex data for blockchain storage
      const dataString = JSON.stringify({
        ...entry,
        transactionData,
      });

      const hexData = ethers.hexlify(ethers.toUtf8Bytes(dataString));

      // Create a simple transaction to store the data
      const transaction = {
        to: entry.companyAddress,
        value: ethers.parseEther("0"), // No ETH transfer, just data storage
        data: hexData,
        gasLimit: 100000,
      };

      // Send transaction
      const txResponse = await this.wallet.sendTransaction(transaction);
      console.log("[blockchain] Transaction sent:", txResponse.hash);

      // Wait for confirmation
      const receipt = await txResponse.wait();

      if (!receipt) {
        throw new Error("Transaction failed to confirm");
      }

      console.log("[blockchain] Transaction confirmed:", receipt.hash);

      return {
        transactionHash: receipt.hash,
        blockHash: receipt.blockHash || "",
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        status: receipt.status || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[blockchain] Transaction failed:", error);
      throw new Error(`Blockchain transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private mockAddProductPricing(
    entry: ProductPricingEntry
  ): BlockchainTransaction {
    // Generate realistic mock blockchain transaction
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const blockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const blockNumber = Math.floor(Date.now() / 15000); // Simulate 15 second blocks
    const gasUsed = BigInt(Math.floor(21000 + Math.random() * 50000));

    console.log("[blockchain-mock] Mock transaction created:", txHash);

    return {
      transactionHash: txHash,
      blockHash,
      blockNumber,
      gasUsed,
      status: 1,
      timestamp: new Date().toISOString(),
    };
  }

  async updateProductPricing(
    entry: ProductPricingEntry,
    previousTransactionHash: string
  ): Promise<BlockchainTransaction> {
    // Include reference to previous transaction for audit trail
    const updatedEntry = {
      ...entry,
      previousTransactionHash,
      timestamp: new Date().toISOString(),
    };

    return this.addProductPricing(updatedEntry);
  }

  async getTransactionDetails(transactionHash: string): Promise<any> {
    if (!this.provider) {
      throw new Error("Blockchain provider not initialized");
    }
    
    try {
      const tx = await this.provider.getTransaction(transactionHash);
      const receipt = await this.provider.getTransactionReceipt(
        transactionHash
      );

      return {
        transaction: tx,
        receipt: receipt,
      };
    } catch (error) {
      console.error("[blockchain] Failed to get transaction details:", error);
      throw error;
    }
  }

  async verifyTransaction(transactionHash: string): Promise<boolean> {
    if (!this.provider) {
      throw new Error("Blockchain provider not initialized");
    }
    
    try {
      const receipt = await this.provider.getTransactionReceipt(
        transactionHash
      );
      return receipt !== null && receipt.status === 1;
    } catch (error) {
      console.error("[blockchain] Failed to verify transaction:", error);
      return false;
    }
  }

  // Mock public blockchain integration (for demo)
  async syncToPublicBlockchain(transactionHash: string): Promise<string> {
    // Simulate public blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock public blockchain hash
    const publicHash = `0xpublic_${transactionHash.slice(2, 10)}_${Date.now()}`;
    console.log("[public-blockchain] Synced to public blockchain:", publicHash);

    return publicHash;
  }

  async getBlockchainInfo(): Promise<any> {
    if (!this.provider) {
      throw new Error("Blockchain provider not initialized");
    }
    
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getFeeData();

      return {
        network: network.name,
        chainId: Number(network.chainId),
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString(),
      };
    } catch (error) {
      console.error("[blockchain] Failed to get blockchain info:", error);
      throw error;
    }
  }
}
