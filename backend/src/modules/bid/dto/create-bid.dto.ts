import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBidDto {
  @ApiProperty({
    description: 'ID of the tender to bid on',
    example: '1'
  })
  @IsString()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty({
    description: 'Name of the contractor',
    example: 'ABC Construction Company'
  })
  @IsString()
  @IsNotEmpty()
  contractorName: string;

  @ApiProperty({
    description: 'Bid amount in Wei',
    example: 800000000000000000
  })
  @IsNumber()
  @Min(1)
  bidAmount: number;

  @ApiProperty({
    description: 'Detailed proposal for the tender',
    example: 'We propose to complete the road construction within 6 months using high-quality materials and experienced workforce.'
  })
  @IsString()
  @IsNotEmpty()
  proposal: string;
}