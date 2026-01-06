import { Module } from '@nestjs/common';
import { AnalyticService } from './analytic.service.js';
import { AnalyticController } from './analytic.controller.js';

@Module({
  providers: [AnalyticService],
  controllers: [AnalyticController],
})
export class AnalyticModule {}
