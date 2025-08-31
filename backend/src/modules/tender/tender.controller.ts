import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TenderService } from './tender.service';
import { CreateTenderDto } from './dto/create-tender.dto';

@ApiTags('tenders')
@Controller('tenders')
export class TenderController {
  constructor(private readonly tenderService: TenderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tender' })
  @ApiResponse({ status: 201, description: 'Tender created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createTender(@Body() createTenderDto: CreateTenderDto) {
    return await this.tenderService.createTender(createTenderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tenders' })
  @ApiResponse({ status: 200, description: 'List of all tenders' })
  async getAllTenders() {
    return await this.tenderService.getAllTenders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tender by ID' })
  @ApiResponse({ status: 200, description: 'Tender details' })
  @ApiResponse({ status: 404, description: 'Tender not found' })
  async getTender(@Param('id') id: string) {
    return await this.tenderService.getTender(id);
  }

  @Get(':id/bids')
  @ApiOperation({ summary: 'Get all bids for a tender' })
  @ApiResponse({ status: 200, description: 'List of bids for the tender' })
  async getTenderBids(@Param('id') id: string) {
    return await this.tenderService.getTenderBids(id);
  }
}