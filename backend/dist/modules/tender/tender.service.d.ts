import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateTenderDto } from './dto/create-tender.dto';
export declare class TenderService {
    private readonly blockchainService;
    private readonly logger;
    constructor(blockchainService: BlockchainService);
    createTender(createTenderDto: CreateTenderDto): Promise<{
        success: boolean;
        tenderId: any;
        transactionHash: any;
        blockNumber: any;
    }>;
    getTender(tenderId: string): Promise<{
        id: any;
        title: any;
        description: any;
        budget: any;
        deadline: any;
        government: any;
        isActive: any;
        isAwarded: any;
        createdAt: any;
    }>;
    getAllTenders(): Promise<any[]>;
    getTenderBids(tenderId: string): Promise<any[]>;
}
