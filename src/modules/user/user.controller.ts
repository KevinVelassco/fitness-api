import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Admin, ApiResultsResponse, Public } from '../../common/decorators';
import { UserService } from './user.service';
import { User } from './user.entity';
import { GetAllResultsResponse } from '../../common/dto';
import {
  CreateUserInput,
  FindAllUsersInput,
  FindOneUserInput,
  UpdateUserInput,
} from './dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiConflictResponse({
    description:
      'User with email already exists. | User with phone already exists.',
  })
  @Public()
  @Post()
  create(@Body() createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @ApiResultsResponse(User)
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiConflictResponse({
    description: 'Limit greater than 50.',
  })
  @Admin()
  @Get()
  findAll(
    @Query() findAllUsersInput: FindAllUsersInput,
  ): Promise<GetAllResultsResponse<User>> {
    return this.userService.findAll(findAllUsersInput);
  }

  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({ description: 'authUid must be a UUID.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Get(':authUid')
  findOne(@Param() findOneUserInput: FindOneUserInput): Promise<User | null> {
    return this.userService.findOne({
      ...findOneUserInput,
      checkIfExists: true,
    });
  }

  @ApiOkResponse({
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiConflictResponse({ description: 'User with phone already exists.' })
  @Patch(':authUid')
  update(
    @Param() findOneUserInput: FindOneUserInput,
    @Body() updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(findOneUserInput, updateUserInput);
  }

  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'authUid must be a UUID.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Delete(':authUid')
  delete(@Param() findOneUserInput: FindOneUserInput): Promise<User> {
    return this.userService.delete(findOneUserInput);
  }
}
