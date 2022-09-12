import { Test, TestingModule } from '@nestjs/testing';

import { PartnerOrganisationRepository } from './partner-organisation.repository';

describe('PartnerOrganisationRepository', () => {
  let repository: PartnerOrganisationRepository;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerOrganisationRepository],
    }).compile();

    repository = module.get<PartnerOrganisationRepository>(
      PartnerOrganisationRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
