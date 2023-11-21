import { IncomingMessage } from 'http';

import { Test, TestingModule } from '@nestjs/testing';

import { AccountPermission } from '@entities/typeorm';

import { uuid } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';
import { ISessionRequest, SessionService } from '@fc/session';

import { EntityType, PermissionsType } from '../enums';
import { AccessControlSession, IPermission } from '../interfaces';
import { AccountPermissionRepository } from '../services';
import { ACCESS_CONTROL_TOKEN } from '../tokens';
import { AccessControlSessionMiddleware } from './access-control-session.middleware';

describe('AccessControlMiddleware', () => {
  let middleware: AccessControlSessionMiddleware;

  const loggerService = {
    setContext: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  };

  const permissionsMock: AccountPermission[] = [
    {
      id: 'hello',
      account: undefined,
      permissionType: PermissionsType.SERVICE_PROVIDER_LIST,
      entity: EntityType.SERVICE_PROVIDER,
      entityId: 'entityIdValue1',
    },
    {
      id: 'hello',
      account: undefined,
      permissionType: PermissionsType.SERVICE_PROVIDER_EDIT,
      entity: EntityType.SERVICE_PROVIDER,
      entityId: 'entityIdValue2',
    },
  ];

  const accountPermissionRepositoryMock = {
    getByAccountId: jest.fn(),
  };

  const accountIdMock = Symbol('accountIdMock');

  const reqMock = {
    sessionId: 'sessionIdValue',
  } as unknown as ISessionRequest & AccessControlSession;
  const resMock = {} as Response;
  const nextMock = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AccessControlSessionMiddleware,
        LoggerService,
        AccountPermissionRepository,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerService)
      .overrideProvider(AccountPermissionRepository)
      .useValue(accountPermissionRepositoryMock)
      .compile();

    middleware = module.get<AccessControlSessionMiddleware>(
      AccessControlSessionMiddleware,
    );

    accountPermissionRepositoryMock.getByAccountId.mockResolvedValueOnce(
      permissionsMock,
    );
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call logger at init', () => {
    expect(loggerService.setContext).toHaveBeenCalledTimes(1);
    expect(loggerService.setContext).toHaveBeenCalledWith(
      middleware.constructor.name,
    );
  });

  describe('use', () => {
    beforeEach(() => {
      middleware['getAccountIdFromContext'] = jest
        .fn()
        .mockResolvedValueOnce(accountIdMock);

      middleware['injectPermissionsIntoContext'] = jest.fn();
    });

    it('should get the accountId from given context', async () => {
      // When
      await middleware.use(reqMock, resMock, nextMock);

      // Then
      expect(middleware['getAccountIdFromContext']).toHaveBeenCalledTimes(1);
      expect(middleware['getAccountIdFromContext']).toHaveBeenCalledWith(
        reqMock,
      );
    });

    it('should call accountPermission.getByAccountId for then given accountId', async () => {
      // When
      await middleware.use(reqMock, resMock, nextMock);

      // Then
      expect(
        accountPermissionRepositoryMock.getByAccountId,
      ).toHaveBeenCalledTimes(1);
      expect(
        accountPermissionRepositoryMock.getByAccountId,
      ).toHaveBeenCalledWith(accountIdMock);
    });

    it('should inject permissions into the context', async () => {
      // When
      await middleware.use(reqMock, resMock, nextMock);

      // Then
      expect(middleware['injectPermissionsIntoContext']).toHaveBeenCalledTimes(
        1,
      );
      expect(middleware['injectPermissionsIntoContext']).toHaveBeenCalledWith(
        reqMock,
        permissionsMock,
      );
    });

    it('should call next', async () => {
      // When
      await middleware.use(reqMock, resMock, nextMock);

      // Then
      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith();
    });
  });

  describe('getAccountIdFromContext', () => {
    const idMock: uuid = 'idValue';

    const userSessionMock = {
      get: jest.fn(),
    };

    let getBoundSessionMock: jest.SpyInstance;

    beforeEach(() => {
      userSessionMock.get.mockReturnValueOnce(idMock);

      getBoundSessionMock = jest.spyOn(SessionService, 'getBoundSession');
      getBoundSessionMock.mockReturnValueOnce(userSessionMock);
    });

    it('should call session handler', async () => {
      // When
      await middleware['getAccountIdFromContext'](reqMock);
      // Then
      expect(getBoundSessionMock).toHaveBeenCalledTimes(1);
      expect(getBoundSessionMock).toHaveBeenCalledWith(
        reqMock,
        'PartnerAccount',
      );
    });

    it('should call userSession.get()', async () => {
      // When
      await middleware['getAccountIdFromContext'](reqMock);
      // Then
      expect(userSessionMock.get).toHaveBeenCalledTimes(1);
      expect(userSessionMock.get).toHaveBeenCalledWith('id');
    });

    it('should return the account id', async () => {
      // When
      const id = await middleware['getAccountIdFromContext'](reqMock);
      // Then
      expect(id).toBe('idValue');
    });

    it('should return false if account is missing', async () => {
      // Given
      userSessionMock.get.mockReset().mockResolvedValue(null);
      // When
      const result = await middleware['getAccountIdFromContext'](reqMock);
      // Then
      expect(result).toBeFalsy();
    });
  });

  describe('injectPermissionsIntoContext', () => {
    it('should be add frozen permissions to req context', () => {
      // Given
      const req = {} as IncomingMessage;
      const Permissions = [
        {
          permissionType: PermissionsType.SERVICE_PROVIDER_LIST,
        },
      ] as IPermission[];

      const resultMock = {
        [ACCESS_CONTROL_TOKEN]: Permissions,
      };
      // When
      middleware['injectPermissionsIntoContext'](req, Permissions);
      // Then
      expect(req).toStrictEqual(resultMock);
      expect(Object.isSealed(req[ACCESS_CONTROL_TOKEN])).toBeTruthy();
    });
  });
});
