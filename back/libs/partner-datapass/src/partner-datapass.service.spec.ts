import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';

import { PartnerDatapassService } from './partner-datapass.service';

describe('PartnerDatapassService', () => {
  let service: PartnerDatapassService;

  const loggerServiceMock = {
    setContext: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerDatapassService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<PartnerDatapassService>(PartnerDatapassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
