import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class PaginationInput {
  @ApiProperty({
    required: false,
    default: 10,
    description: 'Limit the result set to the specified number of resources.',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly limit?: number;

  @ApiProperty({
    required: false,
    default: 0,
    description: 'Skip the specified number of resources in the result set.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly offset?: number;

  @ApiProperty({
    required: false,
    description:
      'Returns only the rows that match the specific lookup fields of the resource.',
  })
  @IsOptional()
  @IsString()
  readonly q?: string;
}
