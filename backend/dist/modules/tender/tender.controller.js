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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tender_service_1 = require("./tender.service");
const create_tender_dto_1 = require("./dto/create-tender.dto");
let TenderController = class TenderController {
    constructor(tenderService) {
        this.tenderService = tenderService;
    }
    async createTender(createTenderDto) {
        return await this.tenderService.createTender(createTenderDto);
    }
    async getAllTenders() {
        return await this.tenderService.getAllTenders();
    }
    async getTender(id) {
        return await this.tenderService.getTender(id);
    }
    async getTenderBids(id) {
        return await this.tenderService.getTenderBids(id);
    }
};
exports.TenderController = TenderController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tender' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tender created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tender_dto_1.CreateTenderDto]),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "createTender", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tenders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all tenders' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "getAllTenders", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tender by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tender details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tender not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "getTender", null);
__decorate([
    (0, common_1.Get)(':id/bids'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bids for a tender' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of bids for the tender' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "getTenderBids", null);
exports.TenderController = TenderController = __decorate([
    (0, swagger_1.ApiTags)('tenders'),
    (0, common_1.Controller)('tenders'),
    __metadata("design:paramtypes", [tender_service_1.TenderService])
], TenderController);
//# sourceMappingURL=tender.controller.js.map