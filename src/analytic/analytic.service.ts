import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma/prisma.service.js';
import { GetAnalyticQueryDto } from './dto/get-analytic-query.dto.js';

type WindowType = 'week' | 'month';

const WEEKDAYS: Array<
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'
> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun..6=Sat
  const diff = (day + 6) % 7; // Monday=0
  d.setDate(d.getDate() - diff);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1, 0, 0, 0, 0);
}

function getRange(type: WindowType, ref: Date) {
  if (type === 'week') {
    const rangeStart = startOfWeekMonday(ref);
    const rangeEnd = addDays(rangeStart, 7);
    return { rangeStart, rangeEnd };
  }

  const rangeStart = startOfMonth(ref);
  const rangeEnd = addMonths(rangeStart, 1);
  return { rangeStart, rangeEnd };
}

function bucketOfTask(status: string, taskDate: Date | null, now: Date) {
  const completed = status === 'COMPLETED';
  if (completed) return 'completed' as const;
  if (!taskDate) return 'planned' as const;
  return taskDate.getTime() < now.getTime()
    ? ('failed' as const)
    : ('planned' as const);
}

@Injectable()
export class AnalyticService {
  async getAnalytic(query: GetAnalyticQueryDto) {
    const ref = query.date ?? new Date();
    const now = new Date();
    const { rangeStart, rangeEnd } = getRange(query.type, ref);

    const tasks = await prisma.task.findMany({
      where: {
        userId: query.uid,
        date: {
          gte: rangeStart,
          lt: rangeEnd,
        },
      },
      select: {
        id: true,
        status: true,
        date: true,
        categoryId: true,
        category: { select: { id: true, name: true, icon: true } },
      },
    });

    const summary = { total: 0, completed: 0, planned: 0, failed: 0 };

    const byWeekday = WEEKDAYS.map((day) => ({
      day,
      total: 0,
      completed: 0,
      planned: 0,
      failed: 0,
    }));

    const categoryMap = new Map<
      string,
      {
        categoryId: string | null;
        name: string;
        icon: string | null;
        total: number;
        completed: number;
        planned: number;
        failed: number;
      }
    >();

    const upsertCategory = (
      categoryId: string | null,
      name: string,
      icon: string | null,
    ) => {
      const key = categoryId ?? '__uncategorized__';
      const existing = categoryMap.get(key);
      if (existing) return existing;
      const created = {
        categoryId,
        name,
        icon,
        total: 0,
        completed: 0,
        planned: 0,
        failed: 0,
      };
      categoryMap.set(key, created);
      return created;
    };

    for (const t of tasks) {
      summary.total += 1;

      const bucket = bucketOfTask(t.status, t.date ?? null, now);
      summary[bucket] += 1;

      const weekdayIdx = ((t.date?.getDay() ?? 1) + 6) % 7; // Monday=0
      const w = byWeekday[weekdayIdx];
      w.total += 1;
      w[bucket] += 1;

      const catId = t.categoryId ?? null;
      const catName = t.category?.name ?? 'Uncategorized';
      const catIcon = t.category?.icon ?? null;
      const c = upsertCategory(catId, catName, catIcon);
      c.total += 1;
      c[bucket] += 1;
    }

    const byCategory = Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return {
      type: query.type,
      rangeStart,
      rangeEnd,
      summary,
      byWeekday,
      byCategory,
    };
  }
}
