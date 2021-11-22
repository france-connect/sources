import { Test, TestingModule } from '@nestjs/testing';

import { UserPreferencesFcpService } from './user-preferences-fcp.service';

describe('UserPreferencesFcpService', () => {
  let service: UserPreferencesFcpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPreferencesFcpService],
    }).compile();

    service = module.get<UserPreferencesFcpService>(UserPreferencesFcpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
