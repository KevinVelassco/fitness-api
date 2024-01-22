import { Body, Controller, Post } from '@nestjs/common';
import { CalorieService } from './calorie.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators';
import {
  CalculatedCaloriesResponse,
  GenerateCaloriesDependingOnTheGoalInput,
} from './dto';

@ApiTags('calorie')
@Controller('calorie')
export class CalorieController {
  constructor(private readonly calorieService: CalorieService) {}

  @ApiCreatedResponse({
    description: 'Calorie calculation successfully generated.',
    type: CalculatedCaloriesResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @Public()
  @Post('calculate-calorie-requirement')
  generateCaloriesDependingOnTheGoal(
    @Body()
    generateCaloriesDependingOnTheGoalInput: GenerateCaloriesDependingOnTheGoalInput,
  ) {
    return this.calorieService.generateCaloriesDependingOnTheGoal(
      generateCaloriesDependingOnTheGoalInput,
    );
  }
}
