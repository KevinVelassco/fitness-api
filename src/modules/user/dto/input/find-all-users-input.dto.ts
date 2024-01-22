import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginationInput } from '../../../../common/dto';

export class FindAllUsersInput extends PartialType(PaginationInput) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString()
  readonly isAdmin?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString()
  readonly isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString()
  readonly verifiedEmail?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  readonly authUid?: string;
}
