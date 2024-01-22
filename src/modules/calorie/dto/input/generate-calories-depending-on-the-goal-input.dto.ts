import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export enum Gender {
  MAN = 'Man',
  WOMEN = 'Women',
}

export enum GoalType {
  CALORIE_DEFICIT = 'Deficit',
  CALORIC_SURPLUS = 'Surplus',
  MAINTENANCE_CALORIES = 'Maintenance',
}

export class GenerateCaloriesDependingOnTheGoalInput {
  @ApiProperty({ example: 60 })
  @IsNumber()
  readonly weightInKg: number;

  @ApiProperty({ enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender)
  readonly gender: Gender;

  @ApiProperty({ enum: GoalType, example: GoalType.CALORIC_SURPLUS })
  @IsNotEmpty()
  @IsEnum(GoalType)
  readonly goalType: GoalType;

  @ApiProperty({ example: 10, minimum: 10, maximum: 30 })
  @Min(10)
  @Max(30)
  @IsInt()
  caloriePercentageValue: number;

  @ApiProperty({ example: 2, minimum: 0.8, maximum: 2.5 })
  @Min(0.8)
  @Max(2.5)
  @IsNumber()
  gramOfProteinPerKgOfWeight: number;

  @ApiProperty({ example: 1.5, minimum: 1, maximum: 2 })
  @Min(1)
  @Max(2)
  @IsNumber()
  gramOfFatPerKgOfWeight: number;
}