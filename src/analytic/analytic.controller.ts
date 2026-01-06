import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticResponseDto } from './dto/analytic.dto.js';
import { GetAnalyticQueryDto } from './dto/get-analytic-query.dto.js';
import { AnalyticService } from './analytic.service.js';

@ApiTags('analytic')
@Controller('analytic')
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get analytics by week or month (total/completed/planned/failed + breakdowns)',
  })
  @ApiOkResponse({ type: AnalyticResponseDto })
  getAnalytic(@Query() query: GetAnalyticQueryDto) {
    return this.analyticService.getAnalytic(query);
  }
}
