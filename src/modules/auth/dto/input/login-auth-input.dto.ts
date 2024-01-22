import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthInput {
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;
}
