import { Test, TestingModule } from '@nestjs/testing';

import { AccessControlGuard } from '@fc/access-control';
import { LoggerService } from '@fc/logger-legacy';
import { PartnerServiceProviderConfigurationMissingSpIdException } from '@fc/partner-service-provider-configuration';

import { PartnersService } from '../services/partners.service';
import { ServiceProviderConfigurationController } from './service-provider-configuration.controller';

describe('ServiceProviderConfigurationController', () => {
  let controller: ServiceProviderConfigurationController;

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
    error: jest.fn(),
  } as unknown as LoggerService;

  const partnersServiceMock = {
    getConfigurationsFromServiceProvider: jest.fn(),
    saveConfigurationForServiceProvider: jest.fn(),
  };

  const rolesGuardMock = {
    canActivate: () => true,
  };

  const serviceProviderIdMock = 'one-uuid-configuration-id';

  const queryMock = {
    serviceProviderId: 'one-uuid-configuration-id',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceProviderConfigurationController],
      providers: [PartnersService, LoggerService],
    })
      .overrideGuard(AccessControlGuard)
      .useValue(rolesGuardMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(PartnersService)
      .useValue(partnersServiceMock)
      .compile();

    controller = app.get<ServiceProviderConfigurationController>(
      ServiceProviderConfigurationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getConfigurationsFromServiceProvider', () => {
    it('should call partnerService.getConfigurationsFromServiceProvider()', async () => {
      // When
      await controller.getConfigurationsFromServiceProvider(queryMock);

      // Then
      expect(
        partnersServiceMock.getConfigurationsFromServiceProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        partnersServiceMock.getConfigurationsFromServiceProvider,
      ).toHaveBeenCalledWith(serviceProviderIdMock);
    });

    it('should return configurations from getConfigurationsFromServiceProvider', async () => {
      // Given
      const getServiceResponseMock = Symbol('getServiceResponseMock');
      partnersServiceMock.getConfigurationsFromServiceProvider.mockResolvedValueOnce(
        getServiceResponseMock,
      );

      // When
      const result =
        await controller.getConfigurationsFromServiceProvider(queryMock);

      // Then
      expect(result).toEqual(getServiceResponseMock);
    });
  });

  describe('postServiceProviderConfiguration', () => {
    it('should throw a PartnerServiceProviderConfigurationMissingSpIdException error when serviceproviderid is missing', async () => {
      // Given
      const serviceProviderIdMockValue = { serviceProviderId: '' };

      // When
      await expect(
        controller.postServiceProviderConfiguration(serviceProviderIdMockValue),
        // Then
      ).rejects.toThrow(
        PartnerServiceProviderConfigurationMissingSpIdException,
      );
    });

    it('should call partnerService.saveConfigurationForServiceProvider()', async () => {
      // Given
      const bodyMock = {
        serviceProviderId: 'one-uuid-configuration-id',
      };
      // When
      await controller.postServiceProviderConfiguration(bodyMock);

      // Then
      expect(
        partnersServiceMock.saveConfigurationForServiceProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        partnersServiceMock.saveConfigurationForServiceProvider,
      ).toHaveBeenCalledWith(serviceProviderIdMock);
    });

    it('should return result from saveConfigurationForServiceProvider', async () => {
      // Given
      const postServiceResponseMock = Symbol('getServiceResponseMock');

      const bodyMock = {
        serviceProviderId: 'one-uuid-configuration-id',
      };
      partnersServiceMock.saveConfigurationForServiceProvider.mockResolvedValueOnce(
        postServiceResponseMock,
      );

      // When
      const result =
        await controller.postServiceProviderConfiguration(bodyMock);

      // Then
      expect(result).toEqual(postServiceResponseMock);
    });
  });
});
