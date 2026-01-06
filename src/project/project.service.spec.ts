import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

jest.unstable_mockModule('../prisma/prisma.service.js', () => ({
  prisma: {
    project: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const { ProjectService } = await import('./project.service.js');

describe('ProjectService', () => {
  let service: InstanceType<typeof ProjectService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService],
    }).compile();

    service = module.get(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
