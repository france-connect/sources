import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';

import { CustomIdentityGuard } from './custom-identity.guard';

describe('CustomIdentityGuard', () => {
  let guard: CustomIdentityGuard;
  const configMock = getConfigMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomIdentityGuard,
        {
          provide: ConfigService,
          useValue: configMock,
        },
      ],
    }).compile();

    guard = module.get<CustomIdentityGuard>(CustomIdentityGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if allowCustomIdentity is true', () => {
      configMock.get.mockReturnValue({ allowCustomIdentity: true });

      expect(guard.canActivate({} as ExecutionContext)).toBe(true);
    });

    it('should return false if allowCustomIdentity is false', () => {
      configMock.get.mockReturnValue({ allowCustomIdentity: false });

      expect(guard.canActivate({} as ExecutionContext)).toBe(false);
    });
  });
});
