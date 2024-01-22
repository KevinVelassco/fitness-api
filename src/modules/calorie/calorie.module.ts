import { Module } from '@nestjs/common';
import { CalorieService } from './calorie.service';
import { CalorieController } from './calorie.controller';

@Module({
  controllers: [CalorieController],
  providers: [CalorieService],
})
export class CalorieModule {}
