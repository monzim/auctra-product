import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenderDto {
  @ApiProperty({
    description: 'Title of the tender',
    example: 'Road Construction Project'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the tender',
    example: 'Construction of 5km road with proper drainage system'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Budget amount in Wei',
    example: 1000000000000000000
  })
  @IsNumber()
  @Min(1)
  budget: number;

  @ApiProperty({
    description: 'Deadline timestamp (Unix timestamp)',
    example: 1703980800
  })
  @IsNumber()
  @Min(Date.now() / 1000)
  deadline: number;
}