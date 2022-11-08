import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import {
  EntityType,
  IPermission,
  PermissionsRequestInformations,
  PermissionsType,
  UnknownPermissionException,
} from '@fc/access-control';
import { LoggerService } from '@fc/logger-legacy';

import { AppPermissionsHandler } from './app-permissions.handler';

describe('AppPermissionsHandler', () => {
  let service: AppPermissionsHandler;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const reflectorMock = {};

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppPermissionsHandler],
      providers: [LoggerService, Reflector],
    })
      .overrideProvider(Reflector)
      .useValue(reflectorMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<AppPermissionsHandler>(AppPermissionsHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkPermissions()', () => {
    const spListReturnValue = Symbol('spListReturnValue');
    const spIdReturnValue = Symbol('spIdReturnValue');

    beforeEach(() => {
      service['checkServiceProviderList'] = jest
        .fn()
        .mockReturnValueOnce(spListReturnValue);
      service['checkServiceProviderId'] = jest
        .fn()
        .mockReturnValueOnce(spIdReturnValue);
    });

    it('should return call to this.checkServiceProviderList() for permission SERVICE_PROVIDER_LIST', () => {
      // Given
      const contextMock = {} as ExecutionContext;
      // When
      const result = service['checkPermissions'](
        PermissionsType.SERVICE_PROVIDER_LIST,
        contextMock,
      );
      // Then
      expect(service['checkServiceProviderList']).toHaveBeenCalledTimes(1);
      expect(service['checkServiceProviderList']).toHaveBeenCalledWith(
        contextMock,
      );
      expect(result).toBe(spListReturnValue);
    });

    it('should return call to this.checkServiceProviderId() for permission SERVICE_PROVIDER_EDIT', () => {
      // Given
      const contextMock = {} as ExecutionContext;
      // When
      const result = service['checkPermissions'](
        PermissionsType.SERVICE_PROVIDER_EDIT,
        contextMock,
      );
      // Then
      expect(service['checkServiceProviderId']).toHaveBeenCalledTimes(1);
      expect(service['checkServiceProviderId']).toHaveBeenCalledWith(
        contextMock,
        PermissionsType.SERVICE_PROVIDER_EDIT,
      );
      expect(result).toBe(spIdReturnValue);
    });

    it('should return call to this.checkServiceProviderId() for permission SERVICE_PROVIDER_VIEW', () => {
      // Given
      const contextMock = {} as ExecutionContext;
      // When
      const result = service['checkPermissions'](
        PermissionsType.SERVICE_PROVIDER_VIEW,
        contextMock,
      );
      // Then
      expect(service['checkServiceProviderId']).toHaveBeenCalledTimes(1);
      expect(service['checkServiceProviderId']).toHaveBeenCalledWith(
        contextMock,
        PermissionsType.SERVICE_PROVIDER_VIEW,
      );
      expect(result).toBe(spIdReturnValue);
    });

    it('should raise an UnkwownRolesException if an unknown permission is given', () => {
      // Given
      const contextMock = {} as ExecutionContext;
      // When
      expect(
        () =>
          service['checkPermissions'](
            'UNKNOWN_PERMISSION' as PermissionsType,
            contextMock,
          ),
        // Then
      ).toThrow(UnknownPermissionException);
    });
  });

  describe('PermissionsValidators', () => {
    let extractContextInfosMock: jest.Mock;
    let matchPermissionMock: jest.Mock;

    const userPermissionsMock: IPermission[] = [
      {
        permissionType: PermissionsType.SERVICE_PROVIDER_LIST,
        entity: EntityType.SERVICE_PROVIDER,
        entityId: 'entityIdValue',
      },
    ];

    const infoMock: PermissionsRequestInformations = {
      body: expect.any(Object),
      params: {
        id: 'idValue',
      },
      query: expect.any(Object),
      userPermissions: userPermissionsMock,
    };

    beforeEach(() => {
      extractContextInfosMock = service['extractContextInfos'] = jest.fn();
      extractContextInfosMock.mockReturnValueOnce(infoMock);

      matchPermissionMock = service['standardMatchPermission'] = jest.fn();
    });

    describe('checkServiceProviderList()', () => {
      const ctxMock = {} as ExecutionContext;

      const permissionMock: IPermission = {
        permissionType: PermissionsType.SERVICE_PROVIDER_LIST,
        entity: null,
        entityId: null,
      };

      it('should extract infos from context', () => {
        // Given
        matchPermissionMock.mockReturnValueOnce(true);

        // When
        service['checkServiceProviderList'](ctxMock);
        // Then
        expect(extractContextInfosMock).toHaveBeenCalledTimes(1);
        expect(extractContextInfosMock).toHaveBeenCalledWith(ctxMock);
      });

      it("should return the matchRole's call result", () => {
        // Given
        matchPermissionMock.mockReturnValueOnce(true);
        // When
        const result = service['checkServiceProviderList'](ctxMock);
        // Then
        expect(result).toBe(true);
        expect(matchPermissionMock).toHaveBeenCalledTimes(1);
        expect(matchPermissionMock).toHaveBeenCalledWith(
          userPermissionsMock,
          permissionMock,
        );
      });

      it('should not match permissions', () => {
        // Given
        matchPermissionMock.mockReturnValueOnce(false);
        // When
        const result = service['checkServiceProviderList'](ctxMock);

        // Then
        expect(result).toBe(false);
        expect(matchPermissionMock).toHaveBeenCalledTimes(1);
        expect(matchPermissionMock).toHaveBeenCalledWith(
          userPermissionsMock,
          permissionMock,
        );
      });
    });

    describe('checkServiceProviderId()', () => {
      const ctxMock = {} as ExecutionContext;

      const permissionMock: IPermission = {
        permissionType: PermissionsType.SERVICE_PROVIDER_EDIT,
        entity: EntityType.SERVICE_PROVIDER,
        entityId: infoMock.params.id,
      };

      it('should extract infos from context', () => {
        // Given
        matchPermissionMock.mockReturnValueOnce(true);

        // When
        service['checkServiceProviderId'](
          ctxMock,
          PermissionsType.SERVICE_PROVIDER_EDIT,
        );
        // Then
        expect(extractContextInfosMock).toHaveBeenCalledTimes(1);
        expect(extractContextInfosMock).toHaveBeenCalledWith(ctxMock);
      });

      it('should call matchRole with permission, entityType and entityId', () => {
        // Given
        matchPermissionMock.mockReturnValueOnce(true);

        // When
        service['checkServiceProviderId'](
          ctxMock,
          PermissionsType.SERVICE_PROVIDER_EDIT,
        );
        // Then
        expect(matchPermissionMock).toHaveBeenCalledTimes(1);
        expect(matchPermissionMock).toHaveBeenCalledWith(
          userPermissionsMock,
          permissionMock,
        );
      });

      it("should return the matchRole's call result", () => {
        // Given
        matchPermissionMock.mockReturnValueOnce(true);
        // When
        const result = service['checkServiceProviderId'](
          ctxMock,
          PermissionsType.SERVICE_PROVIDER_EDIT,
        );
        // Then
        expect(result).toBe(true);
        expect(matchPermissionMock).toHaveBeenCalledTimes(1);
        expect(matchPermissionMock).toHaveBeenCalledWith(
          userPermissionsMock,
          permissionMock,
        );
      });
    });
  });
});
