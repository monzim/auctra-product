import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Injectable()
export class BidService {
  private readonly logger = new Logger(BidService.name);

  constructor(private readonly blockchainService: BlockchainService) {}

  async createBid(createBidDto: CreateBidDto) {
    try {
      const contract = await this.blockchainService.getContract();
      
      if (!contract) {
        throw new BadRequestException('Blockchain contract not available');
      }

      const { tenderId, contractorName, bidAmount, proposal } = createBidDto;
      
      this.logger.log(`Creating bid for tender ${tenderId} by ${contractorName}`);
      
      const tx = await contract.submitBid(tenderId, contractorName, bidAmount, proposal);
      
      const receipt = await tx.wait();
      
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'BidSubmitted';
        } catch {
          return false;
        }
      });

      let bidId = null;
      if (event) {
        const parsedEvent = contract.interface.parseLog(event);
        bidId = parsedEvent?.args?.bidId?.toString();
      }

      this.logger.log(`Bid created successfully with ID: ${bidId}`);
      
      return {
        success: true,
        bidId,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      this.logger.error('Error creating bid:', error);
      throw new BadRequestException(`Failed to create bid: ${error.message}`);
    }
  }

  async getBid(bidId: string) {
    try {
      const contract = await this.blockchainService.getContract();
      
      const bid = await contract.getBid(bidId);
      
      return {
        id: bid.id.toString(),
        tenderId: bid.tenderId.toString(),
        contractor: bid.contractor,
        contractorName: bid.contractorName,
        bidAmount: bid.bidAmount.toString(),
        proposal: bid.proposal,
        submittedAt: bid.submittedAt.toString(),
        isWithdrawn: bid.isWithdrawn,
      };
    } catch (error) {
      this.logger.error('Error getting bid:', error);
      throw new BadRequestException(`Failed to get bid: ${error.message}`);
    }
  }

  async getAllBids() {
    try {
      const contract = await this.blockchainService.getContract();
      
      const bidIds = await contract.getAllBids();
      
      const bids = await Promise.all(
        bidIds.map(async (id: bigint) => {
          try {
            return await this.getBid(id.toString());
          } catch (error) {
            this.logger.error(`Error fetching bid ${id}:`, error);
            return null;
          }
        })
      );
      
      return bids.filter(bid => bid !== null);
    } catch (error) {
      this.logger.error('Error getting all bids:', error);
      throw new BadRequestException(`Failed to get bids: ${error.message}`);
    }
  }

  async getContractorBids(contractor: string) {
    try {
      const contract = await this.blockchainService.getContract();
      
      const bidIds = await contract.getContractorBids(contractor);
      
      const bids = await Promise.all(
        bidIds.map(async (bidId: bigint) => {
          try {
            return await this.getBid(bidId.toString());
          } catch (error) {
            this.logger.error(`Error fetching bid ${bidId}:`, error);
            return null;
          }
        })
      );
      
      return bids.filter(bid => bid !== null);
    } catch (error) {
      this.logger.error('Error getting contractor bids:', error);
      throw new BadRequestException(`Failed to get contractor bids: ${error.message}`);
    }
  }
}