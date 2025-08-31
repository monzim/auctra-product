"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TenderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenderService = void 0;
const common_1 = require("@nestjs/common");
const blockchain_service_1 = require("../blockchain/blockchain.service");
let TenderService = TenderService_1 = class TenderService {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
        this.logger = new common_1.Logger(TenderService_1.name);
    }
    async createTender(createTenderDto) {
        try {
            const contract = await this.blockchainService.getContract();
            if (!contract) {
                throw new common_1.BadRequestException('Blockchain contract not available');
            }
            const { title, description, budget, deadline } = createTenderDto;
            this.logger.log(`Creating tender: ${title}`);
            const tx = await contract.createTender(title, description, budget, deadline);
            const receipt = await tx.wait();
            const event = receipt.logs.find((log) => {
                try {
                    const parsed = contract.interface.parseLog(log);
                    return parsed?.name === 'TenderCreated';
                }
                catch {
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
        }
        catch (error) {
            this.logger.error('Error creating tender:', error);
            throw new common_1.BadRequestException(`Failed to create tender: ${error.message}`);
        }
    }
    async getTender(tenderId) {
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
        }
        catch (error) {
            this.logger.error('Error getting tender:', error);
            throw new common_1.BadRequestException(`Failed to get tender: ${error.message}`);
        }
    }
    async getAllTenders() {
        try {
            const contract = await this.blockchainService.getContract();
            const tenderIds = await contract.getAllTenders();
            const tenders = await Promise.all(tenderIds.map(async (id) => {
                try {
                    return await this.getTender(id.toString());
                }
                catch (error) {
                    this.logger.error(`Error fetching tender ${id}:`, error);
                    return null;
                }
            }));
            return tenders.filter(tender => tender !== null);
        }
        catch (error) {
            this.logger.error('Error getting all tenders:', error);
            throw new common_1.BadRequestException(`Failed to get tenders: ${error.message}`);
        }
    }
    async getTenderBids(tenderId) {
        try {
            const contract = await this.blockchainService.getContract();
            const bidIds = await contract.getTenderBids(tenderId);
            const bids = await Promise.all(bidIds.map(async (bidId) => {
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
                }
                catch (error) {
                    this.logger.error(`Error fetching bid ${bidId}:`, error);
                    return null;
                }
            }));
            return bids.filter(bid => bid !== null);
        }
        catch (error) {
            this.logger.error('Error getting tender bids:', error);
            throw new common_1.BadRequestException(`Failed to get tender bids: ${error.message}`);
        }
    }
};
exports.TenderService = TenderService;
exports.TenderService = TenderService = TenderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [blockchain_service_1.BlockchainService])
], TenderService);
//# sourceMappingURL=tender.service.js.map