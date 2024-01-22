import { Gender } from './generate-calories-depending-on-the-goal-input.dto';

export class GenerateNormocaloricCaloriesInput {
  readonly weightInKg: number;
  readonly gender: Gender;
}
