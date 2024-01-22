import { OmitType } from '@nestjs/swagger';
import { CreateUserInput } from './create-user-input.dto';

export class UpdateUserInput extends OmitType(CreateUserInput, [
  'email',
  'password',
] as const) {}
