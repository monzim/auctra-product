import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface TenderData {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  government: string;
  isActive: boolean;
  isAwarded: boolean;
  createdAt: string;
}

export interface BidData {
  id: string;
  tenderId: string;
  contractor: string;
  contractorName: string;
  bidAmount: string;
  proposal: string;
  submittedAt: string;
  isWithdrawn: boolean;
}

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private contractAddress: string | null = null;
  private contractABI: any[] | null = null;

  async initialize() {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        await this.loadContract();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to initialize blockchain service:", error);
      return false;
    }
  }

  private async loadContract() {
    try {
      const response = await fetch("/contracts/AuctraTender.json");
      if (response.ok) {
        const contractData = await response.json();
        this.contractAddress = contractData.address;
        this.contractABI = JSON.parse(contractData.abi);

        if (this.provider && this.contractAddress && this.contractABI) {
          this.contract = new ethers.Contract(
            this.contractAddress,
            this.contractABI,
            this.provider
          );
        }
      }
    } catch (error) {
      console.error("Failed to load contract:", error);
    }
  }

  async connectWallet(): Promise<string | null> {
    try {
      if (!this.provider) {
        throw new Error("Provider not initialized");
      }

      await this.provider.send("eth_requestAccounts", []);
      this.signer = await this.provider.getSigner();
      const address = await this.signer.getAddress();

      if (this.contract && this.signer) {
        this.contract = this.contract.connect(this.signer) as ethers.Contract;
      }

      return address;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return null;
    }
  }

  async createTender(
    title: string,
    description: string,
    budget: string,
    deadline: number
  ) {
    try {
      if (!this.contract || !this.signer) {
        throw new Error("Contract not initialized or wallet not connected");
      }

      const budgetInWei = ethers.parseEther(budget);
      const tx = await this.contract.createTender(
        title,
        description,
        budgetInWei,
        deadline
      );
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error("Failed to create tender:", error);
      throw error;
    }
  }

  async submitBid(
    tenderId: string,
    contractorName: string,
    bidAmount: string,
    proposal: string
  ) {
    try {
      if (!this.contract || !this.signer) {
        throw new Error("Contract not initialized or wallet not connected");
      }

      const bidAmountInWei = ethers.parseEther(bidAmount);
      const tx = await this.contract.submitBid(
        tenderId,
        contractorName,
        bidAmountInWei,
        proposal
      );
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error("Failed to submit bid:", error);
      throw error;
    }
  }

  async getAllTenders(): Promise<TenderData[]> {
    try {
      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const tenderIds = await this.contract.getAllTenders();
      const tenders: TenderData[] = [];

      for (const id of tenderIds) {
        try {
          const tender = await this.contract.getTender(id);
          tenders.push({
            id: tender.id.toString(),
            title: tender.title,
            description: tender.description,
            budget: ethers.formatEther(tender.budget),
            deadline: tender.deadline.toString(),
            government: tender.government,
            isActive: tender.isActive,
            isAwarded: tender.isAwarded,
            createdAt: tender.createdAt.toString(),
          });
        } catch (error) {
          console.error(`Failed to fetch tender ${id}:`, error);
        }
      }

      return tenders;
    } catch (error) {
      console.error("Failed to get all tenders:", error);
      return [];
    }
  }

  async getTenderBids(tenderId: string): Promise<BidData[]> {
    try {
      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const bidIds = await this.contract.getTenderBids(tenderId);
      const bids: BidData[] = [];

      for (const id of bidIds) {
        try {
          const bid = await this.contract.getBid(id);
          bids.push({
            id: bid.id.toString(),
            tenderId: bid.tenderId.toString(),
            contractor: bid.contractor,
            contractorName: bid.contractorName,
            bidAmount: ethers.formatEther(bid.bidAmount),
            proposal: bid.proposal,
            submittedAt: bid.submittedAt.toString(),
            isWithdrawn: bid.isWithdrawn,
          });
        } catch (error) {
          console.error(`Failed to fetch bid ${id}:`, error);
        }
      }

      return bids;
    } catch (error) {
      console.error("Failed to get tender bids:", error);
      return [];
    }
  }

  formatTimestamp(timestamp: string): string {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  }

  isWalletConnected(): boolean {
    return this.signer !== null;
  }

  getContractAddress(): string | null {
    return this.contractAddress;
  }
}

export const blockchainService = new BlockchainService();
