import { Test, TestingModule } from '@nestjs/testing';

import { MockRnippService } from './mock-rnipp.service';

describe('MockRnippService', () => {
  let service: MockRnippService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockRnippService],
    }).compile();

    service = module.get<MockRnippService>(MockRnippService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
