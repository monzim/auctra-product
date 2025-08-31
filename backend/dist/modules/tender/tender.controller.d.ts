import { TenderService } from './tender.service';
import { CreateTenderDto } from './dto/create-tender.dto';
export declare class TenderController {
    private readonly tenderService;
    constructor(tenderService: TenderService);
    createTender(createTenderDto: CreateTenderDto): Promise<{
        success: boolean;
        tenderId: any;
        transactionHash: any;
        blockNumber: any;
    }>;
    getAllTenders(): Promise<any[]>;
    getTender(id: string): Promise<{
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
    getTenderBids(id: string): Promise<any[]>;
}
