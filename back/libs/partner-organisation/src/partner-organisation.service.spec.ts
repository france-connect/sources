import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';

import { PartnerOrganisationService } from './partner-organisation.service';

describe('PartnerOrganisationService', () => {
  let service: PartnerOrganisationService;

  const loggerServiceMock = {
    setContext: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerOrganisationService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<PartnerOrganisationService>(
      PartnerOrganisationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
