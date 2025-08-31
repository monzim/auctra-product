import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
export declare class BidController {
    private readonly bidService;
    constructor(bidService: BidService);
    createBid(createBidDto: CreateBidDto): Promise<{
        success: boolean;
        bidId: any;
        transactionHash: any;
        blockNumber: any;
    }>;
    getAllBids(): Promise<any[]>;
    getBid(id: string): Promise<{
        id: any;
        tenderId: any;
        contractor: any;
        contractorName: any;
        bidAmount: any;
        proposal: any;
        submittedAt: any;
        isWithdrawn: any;
    }>;
    getContractorBids(address: string): Promise<any[]>;
}
