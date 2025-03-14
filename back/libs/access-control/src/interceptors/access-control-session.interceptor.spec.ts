import { Test, TestingModule } from '@nestjs/testing';

import { PartnersAccountPermission } from '@entities/typeorm';

import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { EntityType, PermissionsType } from '../enums';
import { AccountPermissionRepository } from '../services';
import { ACCESS_CONTROL_TOKEN } from '../tokens';
import { AccessControlSessionInterceptor } from './access-control-session.interceptor';
import deepFreeze = require('deep-freeze');
import { ExecutionContext } from '@nestjs/common';

describe('AccessControlSessionInterceptor', () => {
  let interceptor: AccessControlSessionInterceptor;

  const sessionServiceMock = getSessionServiceMock();

  const loggerServiceMock = {
    debug: jest.fn(),
  };

  const permissionsMock: PartnersAccountPermission[] = [
    {
      accountId: undefined,
      id: 'hello',
      account: undefined,
      permissionType: PermissionsType.VIEW,
      entity: EntityType.SERVICE_PROVIDER,
      entityId: 'entityIdValue1',
    },
    {
      accountId: undefined,
      id: 'hello',
      account: undefined,
      permissionType: PermissionsType.EDIT,
      entity: EntityType.SERVICE_PROVIDER,
      entityId: 'entityIdValue2',
    },
  ];

  const partnersAccountPermissionServiceMock = {
    getByEmail: jest.fn(),
  };

  const emailMock = Symbol('emailMock');

  const ctxMock = {} as ExecutionContext;

  const nextMock = {
    handle: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessControlSessionInterceptor,
        LoggerService,
        SessionService,
        AccountPermissionRepository,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(AccountPermissionRepository)
      .useValue(partnersAccountPermissionServiceMock)
      .compile();

    interceptor = module.get<AccessControlSessionInterceptor>(
      AccessControlSessionInterceptor,
    );

    partnersAccountPermissionServiceMock.getByEmail.mockResolvedValueOnce(
      permissionsMock,
    );

    sessionServiceMock.get.mockReturnValue({
      identity: {
        email: emailMock,
      },
    });
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should call logger at init', () => {
    expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
    expect(loggerServiceMock.debug).toHaveBeenCalledWith(
      interceptor.constructor.name,
    );
  });

  describe('intercept', () => {
    it('should log debug message when use is called', async () => {
      // Given
      sessionServiceMock.get.mockReturnValue({});

      // When
      await interceptor.intercept(ctxMock, nextMock);

      // Then
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        'AccessControlSessionInterceptor',
      );
    });

    it('should get email from sessionService', async () => {
      // When
      await interceptor.intercept(ctxMock, nextMock);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledWith('PartnersAccount');
    });

    it('should call accountPermission.getByAccountEmail when email is present', async () => {
      // When
      await interceptor.intercept(ctxMock, nextMock);

      // Then
      expect(
        partnersAccountPermissionServiceMock.getByEmail,
      ).toHaveBeenCalledWith(emailMock);
    });

    it('should not call accountPermission.getByEmail if session is undefined', async () => {
      // Given
      sessionServiceMock.get.mockReturnValue(undefined);

      // When
      await interceptor.intercept(ctxMock, nextMock);

      // Then
      expect(
        partnersAccountPermissionServiceMock.getByEmail,
      ).toHaveBeenCalledTimes(0);
      expect(nextMock.handle).toHaveBeenCalled();
    });

    it('should not call accountPermission.getByEmail if email is not defined in session', async () => {
      // Given
      sessionServiceMock.get.mockReturnValue({
        accountId: Symbol('accountId'),
      });

      // When
      await interceptor.intercept(ctxMock, nextMock);

      // Then
      expect(
        partnersAccountPermissionServiceMock.getByEmail,
      ).toHaveBeenCalledTimes(0);
      expect(nextMock.handle).toHaveBeenCalled();
    });

    it('should add permissions to partner account session', async () => {
      // Given
      const expected = {
        [ACCESS_CONTROL_TOKEN]: {
          userPermissions: deepFreeze(permissionsMock),
        },
      };
      // When
      await interceptor.intercept(ctxMock, nextMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(
        'PartnersAccount',
        expected,
      );
      expect(nextMock.handle).toHaveBeenCalled();
    });

    it('should add permissions to partner account even if session is undefined', async () => {
      // Given
      const expected = {
        [ACCESS_CONTROL_TOKEN]: {
          userPermissions: deepFreeze([]),
        },
      };

      sessionServiceMock.get.mockReturnValue(undefined);

      // When
      await interceptor.intercept(ctxMock, nextMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(
        'PartnersAccount',
        expected,
      );
      expect(nextMock.handle).toHaveBeenCalled();
    });
  });
});
