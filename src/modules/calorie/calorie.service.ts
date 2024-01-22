import { Injectable } from '@nestjs/common';
import {
  CalculateCaloriesFromCarbohydrateInput,
  CalculateCaloriesFromFatInput,
  CalculateCaloriesFromProteinInput,
  CalculatedCaloriesResponse,
  GenerateCaloriesDependingOnTheGoalInput,
  GenerateNormocaloricCaloriesInput,
} from './dto';
import {
  Gender,
  GoalType,
} from './dto/input/generate-calories-depending-on-the-goal-input.dto';

@Injectable()
export class CalorieService {
  private readonly caloriesPerGramOfProtein = 4;
  private readonly caloriesPerGramOfCarbohydrate = 4;
  private readonly caloriesPerGramOfFat = 9;

  generateCaloriesDependingOnTheGoal(
    generateCaloriesDependingOnTheGoalInput: GenerateCaloriesDependingOnTheGoalInput,
  ): CalculatedCaloriesResponse {
    const {
      weightInKg,
      gender,
      caloriePercentageValue,
      goalType,
      gramOfProteinPerKgOfWeight,
      gramOfFatPerKgOfWeight,
    } = generateCaloriesDependingOnTheGoalInput;

    const normocaloricCalories = this.generateNormocaloricCalories({
      weightInKg,
      gender,
    });

    let totalCalories = normocaloricCalories;

    const amountOfCalories =
      (normocaloricCalories * caloriePercentageValue) / 100;

    switch (goalType) {
      case GoalType.CALORIC_SURPLUS:
        totalCalories = normocaloricCalories + amountOfCalories;
        break;
      case GoalType.CALORIE_DEFICIT:
        totalCalories = normocaloricCalories - amountOfCalories;
        break;
    }

    const caloriesFromProtein = this.calculateCaloriesFromProtein({
      totalCalories,
      weightInKg,
      gramOfProteinPerKgOfWeight,
    });

    const caloriesFromFat = this.calculateCaloriesFromFat({
      totalCalories,
      weightInKg,
      gramOfFatPerKgOfWeight,
    });

    const caloriesFromCarbohydrate = this.calculateCaloriesFromCarbohydrate({
      totalCalories,
      caloriesFromProtein: caloriesFromProtein.calories,
      caloriesFromFat: caloriesFromFat.calories,
    });

    return {
      normocaloricCalories,
      caloriesDependingOnTheGoal: {
        goalType: goalType,
        totalCalories: totalCalories,
      },
      macronutrientDistribution: {
        caloriesFromProtein,
        caloriesFromFat,
        caloriesFromCarbohydrate,
      },
    };
  }

  private generateNormocaloricCalories(
    generateNormocaloricCaloriesInput: GenerateNormocaloricCaloriesInput,
  ): number {
    const { weightInKg, gender } = generateNormocaloricCaloriesInput;

    const genderValue = {
      [Gender.MAN]: 35,
      [Gender.WOMEN]: 33,
    };

    return weightInKg * genderValue[gender];
  }

  private calculateCaloriesFromProtein(
    calculateCaloriesFromProteinInput: CalculateCaloriesFromProteinInput,
  ) {
    const { totalCalories, weightInKg, gramOfProteinPerKgOfWeight } =
      calculateCaloriesFromProteinInput;

    const gramsProtein = weightInKg * gramOfProteinPerKgOfWeight;

    const proteinInCalories = gramsProtein * this.caloriesPerGramOfProtein;

    return {
      grams: gramsProtein,
      calories: proteinInCalories,
      percentage: +((proteinInCalories / totalCalories) * 100).toFixed(2),
    };
  }

  calculateCaloriesFromFat(
    calculateCaloriesFromFatInput: CalculateCaloriesFromFatInput,
  ) {
    const { totalCalories, weightInKg, gramOfFatPerKgOfWeight } =
      calculateCaloriesFromFatInput;

    const gramsFat = weightInKg * gramOfFatPerKgOfWeight;

    const fatInCalories = gramsFat * this.caloriesPerGramOfFat;

    return {
      grams: gramsFat,
      calories: fatInCalories,
      percentage: +((fatInCalories / totalCalories) * 100).toFixed(2),
    };
  }

  calculateCaloriesFromCarbohydrate(
    calculateCaloriesFromCarbohydrateInput: CalculateCaloriesFromCarbohydrateInput,
  ) {
    const { totalCalories, caloriesFromProtein, caloriesFromFat } =
      calculateCaloriesFromCarbohydrateInput;

    const caloriesFromCarbohydrate =
      totalCalories - (caloriesFromProtein + caloriesFromFat);

    const gramsCarbohydrate =
      caloriesFromCarbohydrate / this.caloriesPerGramOfCarbohydrate;

    return {
      grams: gramsCarbohydrate,
      calories: caloriesFromCarbohydrate,
      percentage: +((caloriesFromCarbohydrate / totalCalories) * 100).toFixed(
        2,
      ),
    };
  }
}
