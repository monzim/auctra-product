import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';

@ApiTags('bids')
@Controller('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a new bid' })
  @ApiResponse({ status: 201, description: 'Bid submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createBid(@Body() createBidDto: CreateBidDto) {
    return await this.bidService.createBid(createBidDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bids' })
  @ApiResponse({ status: 200, description: 'List of all bids' })
  async getAllBids() {
    return await this.bidService.getAllBids();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bid by ID' })
  @ApiResponse({ status: 200, description: 'Bid details' })
  @ApiResponse({ status: 404, description: 'Bid not found' })
  async getBid(@Param('id') id: string) {
    return await this.bidService.getBid(id);
  }

  @Get('contractor/:address')
  @ApiOperation({ summary: 'Get all bids by contractor address' })
  @ApiResponse({ status: 200, description: 'List of bids by contractor' })
  async getContractorBids(@Param('address') address: string) {
    return await this.bidService.getContractorBids(address);
  }
}