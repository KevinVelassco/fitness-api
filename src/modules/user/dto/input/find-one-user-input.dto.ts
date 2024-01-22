import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindOneUserInput {
  @ApiProperty({ required: true })
  @IsString()
  @IsUUID()
  readonly authUid: string;

  @IsOptional()
  @IsBoolean()
  readonly checkIfExists?: boolean;
}
