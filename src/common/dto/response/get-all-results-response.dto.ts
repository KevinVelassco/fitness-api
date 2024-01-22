import { ApiProperty } from '@nestjs/swagger';

export class GetAllResultsResponse<Model> {
  @ApiProperty()
  readonly count: number;

  @ApiProperty()
  readonly results: Model[];
}
