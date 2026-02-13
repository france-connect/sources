import * as deepFreeze from 'deep-freeze';

import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PartnersAccountPermission } from '@entities/typeorm';

import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { AccountPermissionRepository } from '../services';
import { AccessControlSessionInterceptor } from './access-control-session.interceptor';

describe('AccessControlSessionInterceptor', () => {
  let interceptor: AccessControlSessionInterceptor;

  const sessionServiceMock = getSessionServiceMock();

  const loggerServiceMock = {
    debug: jest.fn(),
  };

  enum EntityType {
    ENTITY_VALUE = 'entityValue',
  }

  enum PermissionsType {
    PERMISSION_VALUE = 'permissionValue',
  }

  const permissionsMock: PartnersAccountPermission[] = [
    {
      accountId: undefined,
      id: 'hello',
      account: undefined,
      permissionType: PermissionsType.PERMISSION_VALUE,
      entity: EntityType.ENTITY_VALUE,
      entityId: 'entityIdValue1',
    },
    {
      accountId: undefined,
      id: 'hello',
      account: undefined,
      permissionType: PermissionsType.PERMISSION_VALUE,
      entity: EntityType.ENTITY_VALUE,
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
        permissions: deepFreeze(permissionsMock),
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

    it('should not add permissions to partner account if session is undefined', async () => {
      // Given
      sessionServiceMock.get.mockReturnValue(undefined);

      // When
      await interceptor.intercept(ctxMock, nextMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(0);
      expect(nextMock.handle).toHaveBeenCalled();
    });
  });
});
