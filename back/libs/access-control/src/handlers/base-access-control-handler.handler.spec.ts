import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { NO_ENTITY_ID } from '@entities/typeorm';

import { LoggerService } from '@fc/logger';
import { PartnersAccountSession } from '@fc/partners-account';
import { SessionNotFoundException, SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { AccessControl } from '../decorators';
import { MatchType } from '../enums';
import { AccessControlUnknownHandlerException } from '../exceptions';
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
      providers: [AppTest, SessionService, Reflector, LoggerService],
    })
      .overrideProvider(Reflector)
      .useValue(reflectorMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
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

    it('should extract permissions from metadata', () => {
      // Given
      jest
        .mocked(AccessControl.get)
        .mockReturnValueOnce(controllerPermissionsMock);

      // When
      service.handle(contextMock);

      // Then
      expect(AccessControl.get).toHaveBeenCalledExactlyOnceWith(
        service['reflector'],
        contextMock,
      );
    });

    it('should return false if no permission was required', () => {
      // Given
      jest.mocked(AccessControl.get).mockReturnValueOnce(null);
      checkPermissionsMock.mockReturnValueOnce(true);

      // When
      const result = service.handle(contextMock);

      // Then
      expect(result).toBe(false);
    });

    it('should return false if permissionData array was empty', () => {
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
      const result = service.handle(contextMock);

      // Then
      expect(result).toBe(false);
    });

    it('should not check permissions if no permission was required', () => {
      // Given
      jest.mocked(AccessControl.get).mockReturnValueOnce(null);
      checkPermissionsMock.mockReturnValueOnce(true);

      // When
      service.handle(contextMock);

      // Then
      expect(checkPermissionsMock).not.toHaveBeenCalled();
    });

    it('should check permissions based on controller permissions and context', () => {
      // Given
      jest
        .mocked(AccessControl.get)
        .mockReturnValueOnce(controllerPermissionsMock);

      checkPermissionsMock.mockReturnValueOnce(true);

      // When
      service.handle(contextMock);

      // Then
      expect(checkPermissionsMock).toHaveBeenCalledExactlyOnceWith(
        controllerPermissionsMock,
        contextMock,
      );
    });

    it('should return true if permission check succeeded', () => {
      // Given
      jest
        .mocked(AccessControl.get)
        .mockReturnValueOnce(controllerPermissionsMock);

      checkPermissionsMock.mockReturnValueOnce(true);

      // When
      const result = service.handle(contextMock);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if permission check failed', () => {
      // Given
      jest
        .mocked(AccessControl.get)
        .mockReturnValueOnce(controllerPermissionsMock);
      checkPermissionsMock.mockReturnValueOnce(false);

      // When
      const result = service.handle(contextMock);

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

    it('should call matchAllPermissions when matchType is ALL', () => {
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
      service['checkPermissions'](decoratorMock, contextMock);

      // Then
      expect(matchAllPermissionsMock).toHaveBeenCalledExactlyOnceWith(
        decoratorMock.permissionData,
        decoratorMock.options,
        contextMock,
      );
    });

    it('should not call matchAnyPermission when matchType is ALL', () => {
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
      service['checkPermissions'](decoratorMock, contextMock);

      // Then
      expect(matchAnyPermissionMock).not.toHaveBeenCalled();
    });

    it('should return true when matchAllPermissions returns true', () => {
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
      const result = service['checkPermissions'](decoratorMock, contextMock);

      // Then
      expect(result).toBe(true);
    });

    it('should call matchAnyPermission when matchType is ANY', () => {
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
      service['checkPermissions'](decoratorMock, contextMock);

      // Then
      expect(matchAnyPermissionMock).toHaveBeenCalledExactlyOnceWith(
        decoratorMock.permissionData,
        decoratorMock.options,
        contextMock,
      );
    });

    it('should not call matchAllPermissions when matchType is ANY', () => {
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
      service['checkPermissions'](decoratorMock, contextMock);

      // Then
      expect(matchAllPermissionsMock).not.toHaveBeenCalled();
    });

    it('should return true when matchAnyPermission returns true', () => {
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
      const result = service['checkPermissions'](decoratorMock, contextMock);

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

    it('should return true when all permissions match', () => {
      // Given
      checkOnePermissionMock.mockReturnValue(true);

      // When
      const result = service['matchAllPermissions'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should check all permissions when all match', () => {
      // Given
      checkOnePermissionMock.mockReturnValue(true);

      // When
      service['matchAllPermissions'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(checkOnePermissionMock).toHaveBeenCalledTimes(2);
    });

    it('should return false when at least one permission does not match', () => {
      // Given
      checkOnePermissionMock
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      // When
      const result = service['matchAllPermissions'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should stop at first falsy result to save performance', () => {
      // Given
      checkOnePermissionMock
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      // When
      service['matchAllPermissions'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(checkOnePermissionMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('matchAnyPermission', () => {
    const contextMock = {} as ExecutionContext;
    const optionsMock = { matchType: MatchType.ANY };

    let checkOnePermissionMock: jest.Mock;

    beforeEach(() => {
      checkOnePermissionMock = service['checkOnePermission'] = jest.fn();
    });

    it('should return true when at least one permission matches', () => {
      // Given
      checkOnePermissionMock
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      // When
      const result = service['matchAnyPermission'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should stop at first truthy result to save performance', () => {
      // Given
      checkOnePermissionMock
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      // When
      service['matchAnyPermission'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(checkOnePermissionMock).toHaveBeenCalledTimes(1);
    });

    it('should return false when no permission matches', () => {
      // Given
      checkOnePermissionMock.mockReturnValue(false);

      // When
      const result = service['matchAnyPermission'](
        [PERMISSION_DATA, PERMISSION_DATA_2],
        optionsMock,
        contextMock,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should check all permissions when none match', () => {
      // Given
      checkOnePermissionMock.mockReturnValue(false);

      // When
      service['matchAnyPermission'](
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
    });

    it('should extract context info with permission entityIdLocation', () => {
      // When
      service['checkOnePermission'](PERMISSION_DATA, optionsMock, contextMock);

      // Then
      expect(extractContextInfoMock).toHaveBeenCalledExactlyOnceWith(
        contextMock,
        PERMISSION_DATA.entityIdLocation,
      );
    });

    it('should throw AccessControlUnknownHandlerException if handler does not exist', () => {
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
      expect(() =>
        service['checkOnePermission'](
          permissionWithUnknownHandler,
          optionsMock,
          contextMock,
        ),
      ).toThrow(AccessControlUnknownHandlerException);
    });

    it('should call the handler method with correct parameters', () => {
      // Given
      const handlerSpy = jest.spyOn(service as any, HandlerType.HANDLER_METHOD);
      handlerSpy.mockReturnValueOnce(true);

      // When
      service['checkOnePermission'](PERMISSION_DATA, optionsMock, contextMock);

      // Then
      expect(handlerSpy).toHaveBeenCalledExactlyOnceWith(
        PERMISSION_DATA,
        entityIdMock,
        userPermissionsMock,
        optionsMock,
      );
    });

    it('should return true if handler returns true', () => {
      // Given
      const handlerSpy = jest.spyOn(service as any, HandlerType.HANDLER_METHOD);
      handlerSpy.mockReturnValueOnce(true);

      // When
      const result = service['checkOnePermission'](
        PERMISSION_DATA,
        optionsMock,
        contextMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false if handler returns false', () => {
      // Given
      const handlerSpy = jest.spyOn(service as any, HandlerType.HANDLER_METHOD);
      handlerSpy.mockReturnValueOnce(false);

      // When
      const result = service['checkOnePermission'](
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

    const reqMock = {
      params: { instanceId: 'entityId' },
      body: { id: 'bodyEntityId' },
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
        entityId: 'entityId',
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
        entityId: 'bodyEntityId',
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
