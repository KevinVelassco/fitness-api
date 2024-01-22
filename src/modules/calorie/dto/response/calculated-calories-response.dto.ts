import { ApiProperty } from '@nestjs/swagger';
import { GoalType } from '../input/generate-calories-depending-on-the-goal-input.dto';

class CaloriesDependingOnTheGoal {
  @ApiProperty({ enum: GoalType, example: GoalType.CALORIC_SURPLUS })
  goalType: string;

  @ApiProperty()
  totalCalories: number;
}

class MacronutrientResponse {
  @ApiProperty()
  grams: number;

  @ApiProperty()
  calories: number;

  @ApiProperty()
  percentage: number;
}

class MacronutrientDistribution {
  @ApiProperty()
  caloriesFromProtein: MacronutrientResponse;

  @ApiProperty()
  caloriesFromFat: MacronutrientResponse;

  @ApiProperty()
  caloriesFromCarbohydrate: MacronutrientResponse;
}

export class CalculatedCaloriesResponse {
  @ApiProperty()
  readonly normocaloricCalories: number;

  @ApiProperty()
  readonly caloriesDependingOnTheGoal: CaloriesDependingOnTheGoal;

  @ApiProperty()
  readonly macronutrientDistribution: MacronutrientDistribution;
}
