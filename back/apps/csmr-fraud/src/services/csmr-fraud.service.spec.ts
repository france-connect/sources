import { Test, TestingModule } from '@nestjs/testing';

import { CsmrFraudService } from './csmr-fraud.service';

describe('CsmrFraudService', () => {
  let service: CsmrFraudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrFraudService],
    }).compile();

    service = module.get<CsmrFraudService>(CsmrFraudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('should return Hello World!', () => {
      // When / Then
      expect(service.getHello()).toBe('Hello World!');
    });
  });
});
