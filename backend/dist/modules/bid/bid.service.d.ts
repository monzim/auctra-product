import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateBidDto } from './dto/create-bid.dto';
export declare class BidService {
    private readonly blockchainService;
    private readonly logger;
    constructor(blockchainService: BlockchainService);
    createBid(createBidDto: CreateBidDto): Promise<{
        success: boolean;
        bidId: any;
        transactionHash: any;
        blockNumber: any;
    }>;
    getBid(bidId: string): Promise<{
        id: any;
        tenderId: any;
        contractor: any;
        contractorName: any;
        bidAmount: any;
        proposal: any;
        submittedAt: any;
        isWithdrawn: any;
    }>;
    getAllBids(): Promise<any[]>;
    getContractorBids(contractor: string): Promise<any[]>;
}
