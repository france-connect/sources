import { Test, TestingModule } from '@nestjs/testing';

import { PartnerDatapassRepository } from './partner-datapass.repository';

describe('PartnerDatapassRepository', () => {
  let repository: PartnerDatapassRepository;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerDatapassRepository],
    }).compile();

    repository = module.get<PartnerDatapassRepository>(
      PartnerDatapassRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
