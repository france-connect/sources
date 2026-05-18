import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AccessControlInvalidEntityIdException,
  ENTITIES_MAP_TOKEN,
  PermissionInterface,
} from '@fc/access-control';
import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';
import { TypeormService } from '@fc/typeorm';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import {
  AccessControlEntity,
  AccessControlHandler,
  AccessControlPermission,
  DefaultServiceProviderEnum,
} from '../enums';
import { AppPermissionsHandler } from './app-permissions.handler';

describe('AppPermissionsHandler', () => {
  let handler: AppPermissionsHandler;

  const reflectorMock = {} as Reflector;
  const sessionServiceMock = getSessionServiceMock();
  const loggerMock = getLoggerMock();

  const getCountMock = jest.fn();
  const getQueryMock = jest.fn();

  const subQueryBuilderMock = {
    subQuery: jest.fn(),
    select: jest.fn(),
    from: jest.fn(),
    where: jest.fn(),
    getQuery: getQueryMock,
  };

  const queryBuilderMock = {
    innerJoin: jest.fn(),
    where: jest.fn(),
    andWhere: jest.fn(),
    setParameter: jest.fn(),
    getCount: getCountMock,
  };

  const managerMock = {
    createQueryBuilder: jest.fn(),
  };

  const repositoryMock = {
    manager: managerMock,
    createQueryBuilder: jest.fn(),
  };

  const typeormMock = { getRepository: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppPermissionsHandler,
        Reflector,
        SessionService,
        LoggerService,
        TypeormService,
        {
          provide: ENTITIES_MAP_TOKEN,
          useValue: {},
        },
      ],
    })
      .overrideProvider(Reflector)
      .useValue(reflectorMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(TypeormService)
      .useValue(typeormMock)
      .compile();

    handler = module.get<AppPermissionsHandler>(AppPermissionsHandler);

    typeormMock.getRepository.mockReturnValue(repositoryMock);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('LINKABLE_INSTANCES', () => {
    const serviceProviderIdMock = 'sp-id-mock';
    const userPermissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[] = [];
    const contextMock = {} as ExecutionContext;
    const validInstanceId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

    const permissionMock = {
      permission: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: { method: AccessControlHandler.LINKABLE_INSTANCES },
    };
    const getInstancesIdsResult = [validInstanceId];

    beforeEach(() => {
      handler[AccessControlHandler.DIRECT_ENTITY] = jest
        .fn()
        .mockReturnValue(true);
      handler['isUserInstanceCreator'] = jest.fn().mockReturnValue(true);
      handler['getInstancesIds'] = jest
        .fn()
        .mockReturnValue(getInstancesIdsResult);
      handler['checkInstancesIds'] = jest.fn();
    });

    it('should return true if user has access to service provider and is the instance creator', async () => {
      // When
      const result = await handler[AccessControlHandler.LINKABLE_INSTANCES](
        permissionMock,
        serviceProviderIdMock,
        userPermissions,
        contextMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false if user does not have access to service provider', async () => {
      // Given
      handler[AccessControlHandler.DIRECT_ENTITY] = jest
        .fn()
        .mockReturnValueOnce(false);

      // When
      const result = await handler[AccessControlHandler.LINKABLE_INSTANCES](
        permissionMock,
        serviceProviderIdMock,
        userPermissions,
        contextMock,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false if user has access to service provider but no instance ids are provided', async () => {
      // Given
      handler['getInstancesIds'] = jest.fn().mockReturnValueOnce(undefined);

      // When
      const result = await handler[AccessControlHandler.LINKABLE_INSTANCES](
        permissionMock,
        serviceProviderIdMock,
        userPermissions,
        contextMock,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should validate instance ids before checking ownership', async () => {
      // When
      await handler[AccessControlHandler.LINKABLE_INSTANCES](
        permissionMock,
        serviceProviderIdMock,
        userPermissions,
        contextMock,
      );

      // Then
      expect(handler['checkInstancesIds']).toHaveBeenCalledWith(
        getInstancesIdsResult,
      );
    });

    it('should test if user is instance creator with result from getInstancesIds and serviceProviderId', async () => {
      // When
      await handler[AccessControlHandler.LINKABLE_INSTANCES](
        permissionMock,
        serviceProviderIdMock,
        userPermissions,
        contextMock,
      );

      // Then
      expect(handler['isUserInstanceCreator']).toHaveBeenCalledWith(
        getInstancesIdsResult,
        serviceProviderIdMock,
      );
    });

    it('should return false if user is not the instance creator', async () => {
      // Given
      handler['isUserInstanceCreator'] = jest.fn().mockReturnValueOnce(false);

      // When
      const result = await handler[AccessControlHandler.LINKABLE_INSTANCES](
        permissionMock,
        serviceProviderIdMock,
        userPermissions,
        contextMock,
      );

      // Then
      expect(result).toBe(false);
    });
  });

  describe('getInstancesIds', () => {
    // Given
    const getRequestMock = jest.fn();

    const contextMock = {
      switchToHttp: () => ({
        getRequest: getRequestMock,
      }),
    } as unknown as ExecutionContext;

    it('should return instance ids from request body', () => {
      // Given
      const instanceIds = ['instance-id-1', 'instance-id-2'];
      getRequestMock.mockReturnValueOnce({
        body: {
          instanceIds,
        },
      });

      // When
      const result = handler['getInstancesIds'](contextMock);

      // Then
      expect(result).toEqual(instanceIds);
    });

    it('should return undefined if request body is not present', () => {
      // Given
      getRequestMock.mockReturnValueOnce({});

      // When
      const result = handler['getInstancesIds'](contextMock);

      // Then
      expect(result).toEqual(undefined);
    });
  });

  describe('isUserInstanceCreator', () => {
    // Given
    const instanceIds = ['instance-id-1', 'instance-id-2'];
    const accountIdMock = 'account-id-mock';
    const serviceProviderIdMock = 'service-provider-id-mock';

    beforeEach(() => {
      subQueryBuilderMock.subQuery.mockReturnThis();
      subQueryBuilderMock.select.mockReturnThis();
      subQueryBuilderMock.from.mockReturnThis();
      subQueryBuilderMock.where.mockReturnThis();
      getQueryMock.mockReturnValue('(SELECT platformId FROM sp2)');

      queryBuilderMock.innerJoin.mockReturnThis();
      queryBuilderMock.where.mockReturnThis();
      queryBuilderMock.andWhere.mockReturnThis();
      queryBuilderMock.setParameter.mockReturnThis();

      managerMock.createQueryBuilder.mockReturnValue({
        subQuery: jest.fn().mockReturnValue(subQueryBuilderMock),
      });
      repositoryMock.createQueryBuilder.mockReturnValue(queryBuilderMock);

      sessionServiceMock.get.mockReturnValueOnce({
        identity: { id: accountIdMock },
      });
    });

    it('should build a query filtering by instance ids, account id, default service providers and platform', async () => {
      // Given
      getCountMock.mockResolvedValueOnce(0);

      // When
      await handler['isUserInstanceCreator'](
        instanceIds,
        serviceProviderIdMock,
      );

      // Then
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'instance',
      );
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'instance.id IN (:...instanceIds)',
        { instanceIds },
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'creator.id = :accountId',
        { accountId: accountIdMock },
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'sp.id IN (:...defaultSps)',
        {
          defaultSps: [
            DefaultServiceProviderEnum.DEFAULT_LOW_SP,
            DefaultServiceProviderEnum.DEFAULT_HIGH_SP,
          ],
        },
      );
      expect(queryBuilderMock.setParameter).toHaveBeenCalledWith(
        'serviceProviderId',
        serviceProviderIdMock,
      );
    });

    it('should return true if all instances were found to be owned by the user in the database', async () => {
      // Given
      getCountMock.mockResolvedValueOnce(instanceIds.length);

      // When
      const result = await handler['isUserInstanceCreator'](
        instanceIds,
        serviceProviderIdMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false if not all instances were found to be owned by the user in the database', async () => {
      // Given
      getCountMock.mockResolvedValueOnce(1);

      // When
      const result = await handler['isUserInstanceCreator'](
        instanceIds,
        serviceProviderIdMock,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false if no instances were found in the database', async () => {
      // Given
      getCountMock.mockResolvedValueOnce(0);

      // When
      const result = await handler['isUserInstanceCreator'](
        instanceIds,
        serviceProviderIdMock,
      );

      // Then
      expect(result).toBe(false);
    });
  });

  describe('checkInstancesIds', () => {
    it('should not throw when all instance ids are valid UUIDv4', () => {
      // Given
      const instanceIds = [
        'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
        '123e4567-e89b-42d3-a456-426614174000',
      ];

      // When / Then
      expect(() => handler['checkInstancesIds'](instanceIds)).not.toThrow();
    });

    it('should throw AccessControlInvalidEntityIdException when one instance id is not a valid UUIDv4', () => {
      // Given
      const instanceIds = [
        'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
        'invalid-instance-id',
      ];

      // When / Then
      expect(() => handler['checkInstancesIds'](instanceIds)).toThrow(
        AccessControlInvalidEntityIdException,
      );
    });
  });
});
