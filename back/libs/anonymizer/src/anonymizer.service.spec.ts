import { Test, TestingModule } from '@nestjs/testing';

import { AnonymizerService } from './anonymizer.service';

describe('AnonymizerService', () => {
  let service: AnonymizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnonymizerService],
    }).compile();

    service = module.get<AnonymizerService>(AnonymizerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
