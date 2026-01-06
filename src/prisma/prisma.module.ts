import { Module } from '@nestjs/common';
import { prisma } from './prisma.service.js';

@Module({
  providers: [
    {
      provide: 'PRISMA',
      useValue: prisma,
    },
  ],
  exports: ['PRISMA'],
})
export class PrismaModule {}
