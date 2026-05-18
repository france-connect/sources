import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { NO_ENTITY_ID } from '@entities/typeorm';

import { LoggerService } from '@fc/logger';
import { PartnersAccountSession } from '@fc/partners-account';
import { SessionNotFoundException, SessionService } from '@fc/session';
import { TypeormService } from '@fc/typeorm';

import { spyOnAnything } from '@mocks/common';
import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { AccessControl } from '../decorators';
import { MatchType } from '../enums';
import {
  AccessControlInvalidEntityIdException,
  AccessControlUnknownHandlerException,
} from '../exceptions';
import {
  AccessControlDecoratorInterface,
  AccessControlPermissionDataInterface,
} from '../interfaces';
import { BaseAccessControlHandler } from './base-access-control-handler.handler';

jest.mock('../decorators');

describe('BaseAccessControlHandler', () => {
  enum EntityType {
    ENTITY_VALUE = 'entityValue',
  }

  enum PermissionsType {
    PERMISSION_VALUE = 'permissionValue',
    PERMISSION_VALUE_2 = 'permissionValue2',
  }

  enum HandlerType {
    HANDLER_METHOD = 'handlerMethod',
    UNKNOWN_HANDLER = 'unknownHandler',
  }

  let service: BaseAccessControlHandler<
    EntityType,
    PermissionsType,
    HandlerType
  >;

  class AppTest extends BaseAccessControlHandler<
    EntityType,
    PermissionsType,
    HandlerType
  > {
    public handlerMethod(): boolean {
      return true;
    }
  }

  const reflectorMock = {};
  const sessionServiceMock = getSessionServiceMock();
  const loggerMock = getLoggerMock();
  const typeormMock = { getRepository: jest.fn() };

  const PERMISSION_DATA: AccessControlPermissionDataInterface<
    EntityType,
    PermissionsType,
    HandlerType
  > = {
    permission: PermissionsType.PERMISSION_VALUE,
    entity: EntityType.ENTITY_VALUE,
    entityIdLocation: { src: 'params', key: 'instanceId' },
    handler: {
      method: HandlerType.HANDLER_METHOD,
    },
  };

  const PERMISSION_DATA_2: AccessControlPermissionDataInterface<
    EntityType,
    PermissionsType,
    HandlerType
  > = {
    permission: PermissionsType.PERMISSION_VALUE_2,
    entity: EntityType.ENTITY_VALUE,
    entityIdLocation: { src: 'body', key: 'id' },
    handler: {
      method: HandlerType.HANDLER_METHOD,
    },
  };

  const controllerPermissionsMock: AccessControlDecoratorInterface<
    EntityType,
    PermissionsType,
    HandlerType
  > = {
    permissionData: [PERMISSION_DATA],
    options: { matchType: MatchType.ANY },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppTest,
        SessionService,
        Reflector,
        LoggerService,
        TypeormService,
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

    service = module.get<AppTest>(AppTest);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    let checkPermissionsMock: jest.Mock;

    beforeEach(() => {
      checkPermissionsMock = service['checkPermissions'] = jest.fn();
    });

    const contextMock = {} as ExecutionContext;

    it('should extract permissions from metadata', async () => {
      // Given
      jest
        .mocked(AccessControl.get)
        .mockReturnValueOnce(controllerPermissionsMock);

      // When
      await service.handle(contextMock);

      // Then
      expect(AccessControl.get).toHaveBeenCalledExactlyOnceWith(
        service['reflector'],
        contextMock,
      );
    });

    it('should return false if no permission was required', async () => {
      // Given
      jest.mocked(AccessControl.get).mockReturnValueOnce(null);
      checkPermissionsMock.mockReturnValueOnce(true);

      // When
      const result = await service.handle(contextMock);

      // Then
      expect(result).toBe(false);
    });

    it('should return false if permissionData array was empty', async () => {
      // Given
      const controllerPermissionsMock: AccessControlDecoratorInterface<
        EntityType,
        PermissionsType,
        HandlerType
      > = {
        permissionData: [],
        options: { matchType: MatchType.ANY },
      };
      jest
        .mocked(AccessControl.get)
        .mockReturnValueOnce(controllerPermissionsMock);
      checkPermissionsMock.mockReturnValueOnce(true);

      // When
      const result = await service.handle(contextMock);

      // Then
      expect(result).toBe(false);
    });

    it('should not check permissions if no permission was required', async () => {
      // Given
      jest.mocked(AccessControl.get).mockReturnValueOnce(null);
      checkPermissionsMock.mockReturnValueOnce(true);

      // When
      await service.handle(contextMock);

      // Then
      expect(checkPermissionsMock).not.toHaveBeenCalled();
    });

    it('should check permissions based on controller permissions and context', async () => {
      // Given
      jest
        .mocked(AccessControl.get)
        .mockReturnValueOnce(controllerPermissionsMock);

      checkPermissionsMock.mockReturnValueOnce(true);

      // When
      await service.handle(contextMock);

      // Then
      expect(checkPermissionsMock).toHaveBeenCalledExactlyOnceWith(
        controllerPermissionsMock,
        contextMock,
      );
    });

    it('should return true if permission check succeeded', async () => {
      // Given
      jest
        .mocked(AccessControl.get)
        .mockReturnValueOnce(controllerPermissionsMock);

      checkPermissionsMock.mockReturnValueOnce(true);

      // When
      const result = await service.handle(contextMock);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if permission check failed', async () => {
      // Given
      jest
        .mocked(AccessControl.get)
        .mockReturnValueOnce(controllerPermissionsMock);
      checkPermissionsMock.mockReturnValueOnce(false);

      // When
      const result = await service.handle(contextMock);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('checkPermissions', () => {
    const contextMock = {} as ExecutionContext;

    let matchAllPermissionsMock: jest.Mock;
    let matchAnyPermissionMock: jest.Mock;

    beforeEach(() => {
      matchAllPermissionsMock = service['matchAllPermissions'] = jest.fn();
      matchAnyPermissionMock = service['matchAnyPermission'] = jest.fn();
    });

    it('should call matchAllPermissions when matchType is ALL', async () => {
      // Given
      const decoratorMock: AccessControlDecoratorInterface<
        EntityType,
        PermissionsType,
        HandlerType
      > = {
        permissionData: [PERMISSION_DATA],
        options: { matchType: MatchType.ALL },
      };
      matchAllPermissionsMock.mockReturnValueOnce(true);

      // When
      await service['checkPermissions'](decoratorMock, contextMock);

      // Then
      expect(matchAllPermissionsMock).toHaveBeenCalledExactlyOnceWith(
        decoratorMock.permissionData,
        decoratorMock.options,
        contextMock,
      );
    });

    it('should not call matchAnyPermission when matchType is ALL', async () => {
      // Given
      const decoratorMock: AccessControlDecoratorInterface<
        EntityType,
        PermissionsType,
        HandlerType
      > = {
        permissionData: [PERMISSION_DATA],
        options: { matchType: MatchType.ALL },
      };
      matchAllPermissionsMock.mockReturnValueOnce(true);

      // When
      await service['checkPermissions'](decoratorMock, contextMock);

      // Then
      expect(matchAnyPermissionMock).not.toHaveBeenCalled();
    });

    it('should return true when matchAllPermissions returns true', async () => {
      // Given
      const decoratorMock: AccessControlDecoratorInterface<
        EntityType,
        PermissionsType,
        HandlerType
      > = {
        permissionData: [PERMISSION_DATA],
        options: { matchType: MatchType.ALL },
      };
      matchAllPermissionsMock.mockReturnValueOnce(true);

      // When
      const result = await service['checkPermissions'](
        decoratorMock,
        contextMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should call matchAnyPermission when matchType is ANY', async () => {
      // Given
      const decoratorMock: AccessControlDecoratorInterface<
        EntityType,
        PermissionsType,
        HandlerType
      > = {
        permissionData: [PERMISSION_DATA],
        options: { matchType: MatchType.ANY },
      };
      matchAnyPermissionMock.mockReturnValueOnce(true);

      // When
      await service['checkPermissions'](decoratorMock, contextMock);

      // Then
      expect(matchAnyPermissionMock).toHaveBeenCalledExactlyOnceWith(
        decoratorMock.permissionData,
        decoratorMock.options,
        contextMock,
      );
    });

    it('should not call matchAllPermissions when matchType is ANY', async () => {
      // Given
      const decoratorMock: AccessControlDecoratorInterface<
        EntityType,
        PermissionsType,
        HandlerType
      > = {
        permissionData: [PERMISSION_DATA],
        options: { matchType: MatchType.ANY },
      };
      matchAnyPermissionMock.mockReturnValueOnce(true);

      // When
      await service['checkPermissions'](decoratorMock, contextMock);

      // Then
      expect(matchAllPermissionsMock).not.toHaveBeenCalled();
    });

    it('should return true when matchAnyPermission returns true', async () => {
      // Given
      const decoratorMock: AccessControlDecoratorInterface<
        EntityType,
        PermissionsType,
        HandlerType
      > = {
        permissionData: [PERMISSION_DATA],
        options: { matchType: MatchType.ANY },
      };
      matchAnyPermissionMock.mockReturnValueOnce(true);

      // When
      const result = await service['checkPermissions'](
        decoratorMock,
        contextMock,
      );

      // Then
      expect(result).toBe(true);
    });
  });

  describe('matchAllPermissions', () => {
    const contextMock = {} as ExecutionContext;
    const optionsMock = { matchType: MatchType.ALL };

    let checkOnePermissionMock: jest.Mock;

    beforeEach(() => {
      checkOnePermissionMock = service['checkOnePermission'] = jest.fn();
    });

    it('should return true when all permissions match', async () => {
      // Given
      checkOnePermissionMock.mockReturnValue(true);

      // When
      const result = await service['matchAllPermissions'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should check all permissions when all match', async () => {
      // Given
      checkOnePermissionMock.mockReturnValue(true);

      // When
      await service['matchAllPermissions'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(checkOnePermissionMock).toHaveBeenCalledTimes(2);
    });

    it('should return false when at least one permission does not match', async () => {
      // Given
      checkOnePermissionMock
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      // When
      const result = await service['matchAllPermissions'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(result).toBe(false);
    });
  });

  describe('matchAnyPermission', () => {
    const contextMock = {} as ExecutionContext;
    const optionsMock = { matchType: MatchType.ANY };

    let checkOnePermissionMock: jest.Mock;

    beforeEach(() => {
      checkOnePermissionMock = service['checkOnePermission'] = jest.fn();
    });

    it('should return true when at least one permission matches', async () => {
      // Given
      checkOnePermissionMock
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      // When
      const result = await service['matchAnyPermission'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false when no permission matches', async () => {
      // Given
      checkOnePermissionMock.mockReturnValue(false);

      // When
      const result = await service['matchAnyPermission'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should check all permissions when none match', async () => {
      // Given
      checkOnePermissionMock.mockReturnValue(false);

      // When
      await service['matchAnyPermission'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(checkOnePermissionMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('checkOnePermission', () => {
    const contextMock = {} as ExecutionContext;
    const optionsMock = { matchType: MatchType.ANY };

    let extractContextInfoMock: jest.Mock;

    const userPermissionsMock = Symbol('userPermissions');
    const entityIdMock = 'entityId';

    beforeEach(() => {
      extractContextInfoMock = service['extractContextInfo'] = jest.fn();
      extractContextInfoMock.mockReturnValue({
        entityId: entityIdMock,
        userPermissions: userPermissionsMock,
      });

      spyOnAnything(service, HandlerType.HANDLER_METHOD);
    });

    it('should extract context info with permission entityIdLocation', async () => {
      // When
      await service['checkOnePermission'](
        PERMISSION_DATA,
        optionsMock,
        contextMock,
      );

      // Then
      expect(extractContextInfoMock).toHaveBeenCalledExactlyOnceWith(
        contextMock,
        PERMISSION_DATA.entityIdLocation,
      );
    });

    it('should throw AccessControlUnknownHandlerException if handler does not exist', async () => {
      // Given
      const permissionWithUnknownHandler: AccessControlPermissionDataInterface<
        EntityType,
        PermissionsType,
        HandlerType
      > = {
        ...PERMISSION_DATA,
        handler: { method: HandlerType.UNKNOWN_HANDLER },
      };

      // When / Then
      await expect(() =>
        service['checkOnePermission'](
          permissionWithUnknownHandler,
          optionsMock,
          contextMock,
        ),
      ).rejects.toThrow(AccessControlUnknownHandlerException);
    });

    it('should call the handler method with correct parameters', async () => {
      // Given
      jest
        .mocked(service[HandlerType.HANDLER_METHOD])
        .mockReturnValueOnce(true);

      // When
      await service['checkOnePermission'](
        PERMISSION_DATA,
        optionsMock,
        contextMock,
      );

      // Then
      expect(
        jest.mocked(service[HandlerType.HANDLER_METHOD]),
      ).toHaveBeenCalledExactlyOnceWith(
        PERMISSION_DATA,
        entityIdMock,
        userPermissionsMock,
        contextMock,
        optionsMock,
      );
    });

    it('should return true if handler returns true', async () => {
      // Given
      jest
        .mocked(service[HandlerType.HANDLER_METHOD])
        .mockReturnValueOnce(true);

      // When
      const result = await service['checkOnePermission'](
        PERMISSION_DATA,
        optionsMock,
        contextMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false if handler returns false', async () => {
      // Given
      jest
        .mocked(service[HandlerType.HANDLER_METHOD])
        .mockReturnValueOnce(false);

      // When
      const result = await service['checkOnePermission'](
        PERMISSION_DATA,
        optionsMock,
        contextMock,
      );

      // Then
      expect(result).toBe(false);
    });
  });

  describe('extractContextInfo', () => {
    const httpArgMock = {
      getRequest: jest.fn(),
    } as unknown as HttpArgumentsHost;

    const ctxMock = {
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;

    const validUuid = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
    const validUuid2 = 'f1e2d3c4-b5a6-4987-abcd-ef1234567890';

    const reqMock = {
      params: { instanceId: validUuid },
      body: { id: validUuid2 },
    };

    const userPermissionsMock = Symbol('userPermissions');

    const sessionPartnersAccountDataMock = {
      permissions: userPermissionsMock,
      identity: Symbol('identity'),
    } as unknown as PartnersAccountSession<EntityType, PermissionsType>;

    beforeEach(() => {
      jest.mocked(httpArgMock).getRequest.mockReturnValueOnce(reqMock);
      jest.mocked(ctxMock).switchToHttp.mockReturnValueOnce(httpArgMock);
    });

    it('should switch to HTTP context', () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When
      service['extractContextInfo'](ctxMock, PERMISSION_DATA.entityIdLocation);

      // Then
      expect(ctxMock.switchToHttp).toHaveBeenCalledExactlyOnceWith();
    });

    it('should retrieve request from HTTP context', () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When
      service['extractContextInfo'](ctxMock, PERMISSION_DATA.entityIdLocation);

      // Then
      expect(httpArgMock.getRequest).toHaveBeenCalledExactlyOnceWith();
    });

    it('should retrieve session data', () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When
      service['extractContextInfo'](ctxMock, PERMISSION_DATA.entityIdLocation);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        'PartnersAccount',
      );
    });

    it('should return entityId and user permissions', () => {
      // Given
      const resultMock = {
        entityId: validUuid,
        userPermissions: userPermissionsMock,
      };

      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When
      const result = service['extractContextInfo'](
        ctxMock,
        PERMISSION_DATA.entityIdLocation,
      );

      // Then
      expect(result).toStrictEqual(resultMock);
    });

    it('should extract entityId from body when entityIdLocation.src is body', () => {
      // Given
      const resultMock = {
        entityId: validUuid2,
        userPermissions: userPermissionsMock,
      };

      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When
      const result = service['extractContextInfo'](
        ctxMock,
        PERMISSION_DATA_2.entityIdLocation,
      );

      // Then
      expect(result).toStrictEqual(resultMock);
    });

    it('should return entityId with NO_ENTITY_ID value if no entityIdLocation was provided', () => {
      // Given
      const resultMock = {
        entityId: NO_ENTITY_ID,
        userPermissions: userPermissionsMock,
      };

      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When
      const result = service['extractContextInfo'](ctxMock, null);

      // Then
      expect(result).toStrictEqual(resultMock);
    });

    it('should not throw when entityId is a valid UUIDv4', () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When / Then
      expect(() =>
        service['extractContextInfo'](
          ctxMock,
          PERMISSION_DATA.entityIdLocation,
        ),
      ).not.toThrow();
    });

    it('should throw AccessControlInvalidEntityIdException when entityId is not a valid UUIDv4', () => {
      // Given
      const invalidReqMock = {
        params: { instanceId: 'not-a-valid-uuid' },
        body: {},
      };
      jest.mocked(httpArgMock).getRequest.mockReset();
      jest.mocked(ctxMock).switchToHttp.mockReset();
      jest.mocked(httpArgMock).getRequest.mockReturnValueOnce(invalidReqMock);
      jest.mocked(ctxMock).switchToHttp.mockReturnValueOnce(httpArgMock);

      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When / Then
      expect(() =>
        service['extractContextInfo'](
          ctxMock,
          PERMISSION_DATA.entityIdLocation,
        ),
      ).toThrow(AccessControlInvalidEntityIdException);
    });

    it('should not validate entityId when it equals NO_ENTITY_ID', () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When / Then
      expect(() => service['extractContextInfo'](ctxMock, null)).not.toThrow();
    });

    it('should throw SessionNotFoundException if no session was found', () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(null);

      // When / Then
      expect(() =>
        service['extractContextInfo'](
          ctxMock,
          PERMISSION_DATA.entityIdLocation,
        ),
      ).toThrow(SessionNotFoundException);
    });
  });
});
