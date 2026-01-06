import { ApiProperty } from '@nestjs/swagger';

export class AnalyticSummaryDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  completed!: number;

  @ApiProperty({
    description:
      'Tasks not completed and scheduled for now or future (within range)',
  })
  planned!: number;

  @ApiProperty({
    description: 'Tasks not completed and scheduled in the past (within range)',
  })
  failed!: number;
}

export class AnalyticWeekdayBreakdownDto {
  @ApiProperty({
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  })
  day!:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';

  @ApiProperty()
  total!: number;

  @ApiProperty()
  completed!: number;

  @ApiProperty()
  planned!: number;

  @ApiProperty()
  failed!: number;
}

export class AnalyticCategoryBreakdownDto {
  @ApiProperty({ nullable: true })
  categoryId!: string | null;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  icon!: string | null;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  completed!: number;

  @ApiProperty()
  planned!: number;

  @ApiProperty()
  failed!: number;
}

export class AnalyticResponseDto {
  @ApiProperty({ enum: ['week', 'month'] })
  type!: 'week' | 'month';

  @ApiProperty()
  rangeStart!: Date;

  @ApiProperty()
  rangeEnd!: Date;

  @ApiProperty({ type: AnalyticSummaryDto })
  summary!: AnalyticSummaryDto;

  @ApiProperty({ type: AnalyticWeekdayBreakdownDto, isArray: true })
  byWeekday!: AnalyticWeekdayBreakdownDto[];

  @ApiProperty({ type: AnalyticCategoryBreakdownDto, isArray: true })
  byCategory!: AnalyticCategoryBreakdownDto[];
}
