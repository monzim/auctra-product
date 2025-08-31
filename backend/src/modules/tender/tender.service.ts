import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateTenderDto } from './dto/create-tender.dto';

@Injectable()
export class TenderService {
  private readonly logger = new Logger(TenderService.name);

  constructor(private readonly blockchainService: BlockchainService) {}

  async createTender(createTenderDto: CreateTenderDto) {
    try {
      const contract = await this.blockchainService.getContract();
      
      if (!contract) {
        throw new BadRequestException('Blockchain contract not available');
      }

      const { title, description, budget, deadline } = createTenderDto;
      
      this.logger.log(`Creating tender: ${title}`);
      
      const tx = await contract.createTender(title, description, budget, deadline);
      
      const receipt = await tx.wait();
      
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'TenderCreated';
        } catch {
          return false;
        }
      });

      let tenderId = null;
      if (event) {
        const parsedEvent = contract.interface.parseLog(event);
        tenderId = parsedEvent?.args?.tenderId?.toString();
      }

      this.logger.log(`Tender created successfully with ID: ${tenderId}`);
      
      return {
        success: true,
        tenderId,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      this.logger.error('Error creating tender:', error);
      throw new BadRequestException(`Failed to create tender: ${error.message}`);
    }
  }

  async getTender(tenderId: string) {
    try {
      const contract = await this.blockchainService.getContract();
      
      const tender = await contract.getTender(tenderId);
      
      return {
        id: tender.id.toString(),
        title: tender.title,
        description: tender.description,
        budget: tender.budget.toString(),
        deadline: tender.deadline.toString(),
        government: tender.government,
        isActive: tender.isActive,
        isAwarded: tender.isAwarded,
        createdAt: tender.createdAt.toString(),
      };
    } catch (error) {
      this.logger.error('Error getting tender:', error);
      throw new BadRequestException(`Failed to get tender: ${error.message}`);
    }
  }

  async getAllTenders() {
    try {
      const contract = await this.blockchainService.getContract();
      
      const tenderIds = await contract.getAllTenders();
      
      const tenders = await Promise.all(
        tenderIds.map(async (id: bigint) => {
          try {
            return await this.getTender(id.toString());
          } catch (error) {
            this.logger.error(`Error fetching tender ${id}:`, error);
            return null;
          }
        })
      );
      
      return tenders.filter(tender => tender !== null);
    } catch (error) {
      this.logger.error('Error getting all tenders:', error);
      throw new BadRequestException(`Failed to get tenders: ${error.message}`);
    }
  }

  async getTenderBids(tenderId: string) {
    try {
      const contract = await this.blockchainService.getContract();
      
      const bidIds = await contract.getTenderBids(tenderId);
      
      const bids = await Promise.all(
        bidIds.map(async (bidId: bigint) => {
          try {
            const bid = await contract.getBid(bidId.toString());
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
            this.logger.error(`Error fetching bid ${bidId}:`, error);
            return null;
          }
        })
      );
      
      return bids.filter(bid => bid !== null);
    } catch (error) {
      this.logger.error('Error getting tender bids:', error);
      throw new BadRequestException(`Failed to get tender bids: ${error.message}`);
    }
  }
}