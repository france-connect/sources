import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { APP_ACCESS_CONTROL_HANDLER } from '../tokens';
import { AccessControlGuard } from './access-control.guard';

describe('AccessControlGuard', () => {
  let guard: AccessControlGuard<string, string, string>;

  const appRoleHandler = {
    handle: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessControlGuard,
        { provide: APP_ACCESS_CONTROL_HANDLER, useValue: appRoleHandler },
      ],
    }).compile();

    guard = module.get(AccessControlGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    const ctxMock = Symbol('context') as unknown as ExecutionContext;

    it("should return 'true' if the role's check succeed", async () => {
      // Given
      appRoleHandler.handle.mockReturnValueOnce(true);

      // When
      const result = await guard.canActivate(ctxMock);

      // Then
      expect(result).toBe(true);
    });

    it("should return 'false' if the role's check did not succeed", async () => {
      // Given
      appRoleHandler.handle.mockReturnValueOnce(false);

      // When
      const result = await guard.canActivate(ctxMock);

      // Then
      expect(result).toBe(false);
    });
  });
});
