import { Test, TestingModule } from '@nestjs/testing';

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
    login: jest.fn(),
    getServiceProvidersByAccount: jest.fn(),
  };

  const sessionPartnerAccountMock = {
    set: jest.fn(),
    get: jest.fn(),
  };

  const resMock = {
    status: jest.fn(),
    json: jest.fn(),
  };

  const createdAt = new Date();
  const updatedAt = new Date();

  const statusMock = { end: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceProviderController],
      providers: [PartnersService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(PartnersService)
      .useValue(partnersServiceMock)
      .compile();

    controller = app.get<ServiceProviderController>(ServiceProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getServiceProvidersByaccount', () => {
    const expected = {
      meta: { totalItems: 1 },
      payload: [
        {
          id: 'd7d36b81-0b68-4c26-a399-854848164f29',
          name: 'Service Provider - Sandbox',
          status: 'SANDBOX',
          createdAt,
          updatedAt,
          organisation: {
            name: 'Direction Interministerielle du Numérique',
          },
          platform: {
            name: 'FRANCE_CONNECT_LOW',
          },
        },
      ],
    };

    it('should call res.json', async () => {
      // Given
      sessionPartnerAccountMock.get.mockResolvedValueOnce({
        id: '123',
      });
      partnersServiceMock.getServiceProvidersByAccount.mockResolvedValueOnce(
        expected,
      );

      // When
      await controller.getServiceProvidersByAccount(
        0,
        10,
        resMock,
        sessionPartnerAccountMock,
      );

      // Then
      expect(resMock.json).toHaveBeenCalledTimes(1);
      expect(resMock.json).toHaveBeenCalledWith(expected);
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
    });

    it('should call res.status', async () => {
      // Given
      sessionPartnerAccountMock.get.mockResolvedValueOnce({});
      resMock.status.mockReturnValueOnce(statusMock);

      // When
      await controller.getServiceProvidersByAccount(
        1,
        10,
        resMock,
        sessionPartnerAccountMock,
      );
      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(statusMock.end).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(0);
    });

    it('should call looger.error, if user session is not found', async () => {
      // Given
      sessionPartnerAccountMock.get.mockRejectedValueOnce(undefined);
      resMock.status.mockReturnValueOnce(statusMock);

      // When
      await controller.getServiceProvidersByAccount(
        1,
        10,
        resMock,
        sessionPartnerAccountMock,
      );
      // Then
      expect(loggerServiceMock.error).toHaveBeenCalledTimes(1);
    });
  });
});
