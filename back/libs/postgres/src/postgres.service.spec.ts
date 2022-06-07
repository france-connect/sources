import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';

import { PostgresService } from './postgres.service';

describe('PostgresService', () => {
  let service: PostgresService;

  const LoggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
  } as unknown as LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgresService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(LoggerServiceMock)
      .compile();

    service = module.get<PostgresService>(PostgresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
