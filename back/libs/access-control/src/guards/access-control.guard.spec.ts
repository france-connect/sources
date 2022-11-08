import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';

import { APP_ACCESS_CONTROL_HANDLER } from '../tokens';
import { AccessControlGuard } from './access-control.guard';

describe('AccessControlGuard', () => {
  let guard: AccessControlGuard;

  const logger = {
    setContext: jest.fn(),
    debug: jest.fn(),
  };

  const appRoleHandler = {
    checkAllPermissions: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessControlGuard,
        LoggerService,
        { provide: APP_ACCESS_CONTROL_HANDLER, useValue: appRoleHandler },
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(logger)
      .compile();

    guard = module.get<AccessControlGuard>(AccessControlGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should set the logger context', () => {
    expect(logger.setContext).toHaveBeenCalledTimes(1);
    expect(logger.setContext).toHaveBeenCalledWith('AccessControlGuard');
  });

  describe('canActivate', () => {
    const ctxMock = Symbol('context') as unknown as ExecutionContext;

    it("should return 'true' if the role's check succeed", (done) => {
      // Given
      appRoleHandler.checkAllPermissions.mockReturnValueOnce(true);

      // When
      const result$ = guard.canActivate(ctxMock);
      expect.hasAssertions();
      result$.subscribe({
        next: (result) => {
          // Then
          expect(result).toBe(true);
          done();
        },
      });
    });

    it("should return 'false' if the role's check did not succeed", (done) => {
      // Given
      appRoleHandler.checkAllPermissions.mockReturnValueOnce(false);

      // When
      const result$ = guard.canActivate(ctxMock);
      expect.hasAssertions();
      result$.subscribe({
        next: (result) => {
          // Then
          expect(result).toBe(false);
          done();
        },
      });
    });
  });
});
