import { Test, TestingModule } from '@nestjs/testing';

import { HttpOtrsClientService } from './http-otrs-client.service';

describe('HttpOtrsClientService', () => {
  let service: HttpOtrsClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpOtrsClientService],
    }).compile();

    service = module.get<HttpOtrsClientService>(HttpOtrsClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
