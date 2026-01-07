import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { TaskModule } from './task/task.module.js';
import { AnalyticModule } from './analytic/analytic.module.js';
import { ProjectModule } from './project/project.module.js';
import { CategoryModule } from './category/category.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { MediaModule } from './media/media.module.js';
import { NotificationModule } from './noti/noti.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    PrismaModule,
    TaskModule,
    AnalyticModule,
    ProjectModule,
    CategoryModule,
    AuthModule,
    UserModule,
    MediaModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
