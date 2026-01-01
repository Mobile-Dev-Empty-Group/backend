import {
  PrismaClient,
  TaskStatus,
  DayOfWeek,
  AuthProvider,
} from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Đang xóa dữ liệu cũ... ---');
  await prisma.userChallenge.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('--- Đang tạo dữ liệu mẫu (Seeding)... ---');

  const user = await prisma.user.create({
    data: {
      email: 'empty@hcmut.com',
      name: 'Thanh Tâm',
      avatar: 'https://i.pravatar.cc/300?u=thanhtam',
      password: 'password123',
      provider: AuthProvider.EMAIL,
      pushNotifications: true,
      darkMode: false,
      hasFinishedOnboarding: true,
    },
  });

  const workCat = await prisma.category.create({
    data: { name: 'Work', userId: user.id, icon: 'briefcase' },
  });
  const personalCat = await prisma.category.create({
    data: { name: 'Personal', userId: user.id, icon: 'user' },
  });
  const homeworkCat = await prisma.category.create({
    data: { name: 'Homework', userId: user.id, icon: 'book' },
  });

  const groceryProject = await prisma.project.create({
    data: { name: 'Grocery Shopping App', userId: user.id },
  });
  const uberProject = await prisma.project.create({
    data: { name: 'Uber Eats redesign challenge', userId: user.id },
  });

  const mainChallenge = await prisma.challenge.create({
    data: {
      title: "Today's challenge: Complete your top 3 tasks",
      description: 'Start the day strong by finishing your priorities!',
    },
  });

  await prisma.userChallenge.create({
    data: {
      userId: user.id,
      challengeId: mainChallenge.id,
      isCompleted: false,
      date: new Date(),
    },
  });

  await prisma.task.create({
    data: {
      title: 'Design for dashboard project management',
      description: 'This application is designed for super shops...',
      status: TaskStatus.IN_PROGRESS,
      progress: 80,
      isStarred: true,
      duration: 240,
      breakTime: 20,
      date: new Date(),
      startTime: new Date(new Date().setHours(10, 0, 0)),
      endTime: new Date(new Date().setHours(14, 0, 0)),
      repeatDay: DayOfWeek.Thursday,
      userId: user.id,
      categoryId: workCat.id,
      projectId: groceryProject.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Wireframe for E commerce',
      status: TaskStatus.TO_DO,
      startTime: new Date(new Date().setHours(10, 0, 0)),
      endTime: new Date(new Date().setHours(12, 0, 0)),
      userId: user.id,
      categoryId: personalCat.id,
      date: new Date(),
    },
  });

  await prisma.task.create({
    data: {
      title: 'Market Research',
      status: TaskStatus.COMPLETED,
      progress: 100,
      completedAt: new Date(),
      userId: user.id,
      projectId: groceryProject.id,
      date: new Date(),
    },
  });

  console.log('--- Seeding thành công! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
