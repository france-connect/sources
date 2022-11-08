import { Test, TestingModule } from '@nestjs/testing';

import { AccessControlGuard, IPermission } from '@fc/access-control';
import { PaginationOptionDto } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';

import { PartnersService } from '../services/partners.service';
import { ServiceProviderController } from './service-provider.controller';

describe('ServiceProviderController', () => {
  let controller: ServiceProviderController;

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
    error: jest.fn(),
  } as unknown as LoggerService;

  const partnersServiceMock = {
    getServiceProvidersFromPermissions: jest.fn(),
    getServiceProviderById: jest.fn(),
  };

  const rolesGuardMock = {
    canActivate: () => true,
  };

  const partnersDataMock = {
    id: 'idValue',
    name: 'nameValue',
    organisation: 'organisationValue',
    platform: 'platformValue',
    status: 'statusValue',
    updatedAt: 'updatedAtValue',
    createdAt: 'createdAtValue',
    secretDataThatShouldNotBeReturned: 'secretDataThatShouldNotBeReturned',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceProviderController],
      providers: [PartnersService, LoggerService],
    })
      .overrideGuard(AccessControlGuard)
      .useValue(rolesGuardMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(PartnersService)
      .useValue(partnersServiceMock)
      .compile();

    controller = app.get<ServiceProviderController>(ServiceProviderController);
    partnersServiceMock.getServiceProviderById.mockResolvedValueOnce(
      partnersDataMock,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getServiceProviderList', () => {
    const queryMock: PaginationOptionDto = {
      offset: 0,
      size: 10,
    };

    const permissionsMock = [] as unknown as IPermission[];

    it('should call partnerService.getServiceProvidersFromPermissions()', async () => {
      // When
      await controller.getServiceProviderList(permissionsMock, queryMock);
      // Then
      expect(
        partnersServiceMock.getServiceProvidersFromPermissions,
      ).toHaveBeenCalledTimes(1);
      expect(
        partnersServiceMock.getServiceProvidersFromPermissions,
      ).toHaveBeenCalledWith(permissionsMock, queryMock.offset, queryMock.size);
    });

    it('should return result from getServiceProvidersFromPermissions', async () => {
      // Given
      const getServiceResponseMock = Symbol('getServiceResponseMock');
      partnersServiceMock.getServiceProvidersFromPermissions.mockResolvedValueOnce(
        getServiceResponseMock,
      );
      // When
      const result = await controller.getServiceProviderList(
        permissionsMock,
        queryMock,
      );
      // Then
      expect(result).toBe(getServiceResponseMock);
    });
  });

  describe('getServiceProviderView', () => {
    // Given
    const paramsMock = {
      id: 'id-mock-value',
    };

    it('should retrieve service provider informations', async () => {
      // When
      await controller.getServiceProviderView(paramsMock);
      // Then
      expect(partnersServiceMock.getServiceProviderById).toHaveBeenCalledTimes(
        1,
      );

      expect(partnersServiceMock.getServiceProviderById).toHaveBeenCalledWith(
        paramsMock.id,
      );
    });

    it('should return only chosen data with structure', async () => {
      // When
      const result = await controller.getServiceProviderView(paramsMock);
      // Then
      expect(result).toEqual({
        type: 'SERVICE_PROVIDER_VIEW',
        payload: {
          id: 'idValue',
          name: 'nameValue',
          organisation: 'organisationValue',
          platform: 'platformValue',
          status: 'statusValue',
        },
      });
    });
  });

  describe('getServiceProviderEdit', () => {
    // Given
    const paramsMock = {
      id: 'id-mock-value',
    };

    it('should retrieve service provider informations', async () => {
      // When
      await controller.getServiceProviderEdit(paramsMock);
      // Then
      expect(partnersServiceMock.getServiceProviderById).toHaveBeenCalledTimes(
        1,
      );

      expect(partnersServiceMock.getServiceProviderById).toHaveBeenCalledWith(
        paramsMock.id,
      );
    });

    it('should return only chosen properties from service provider data, with FSA structure', async () => {
      // When
      const result = await controller.getServiceProviderEdit(paramsMock);
      // Then
      expect(result).toEqual({
        type: 'SERVICE_PROVIDER_EDIT',
        payload: {
          id: 'idValue',
          name: 'nameValue',
          organisation: 'organisationValue',
          platform: 'platformValue',
          status: 'statusValue',
        },
      });
    });
  });
});
