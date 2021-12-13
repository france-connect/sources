import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { BrokerProxyService } from '../services';
import { BrokerProxyController } from './broker-proxy.controller';

describe('BrokerProxyController', () => {
  let controller: BrokerProxyController;

  const brokerProxyServiceMock = {
    proxyRequest: jest.fn(),
    setHeaders: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
  } as unknown as LoggerService;

  const reqMock = {
    originalUrl: '/fizz',
    method: '',
  };
  const resMock = {
    status: jest.fn(),
  };
  const sendMock = { send: jest.fn() };

  const bodyMock = 'foo=bar&toto=titi';
  const headersMock = { host: 'url.com', 'x-forwarded-proto': 'https' };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrokerProxyController],
      providers: [LoggerService, BrokerProxyService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(BrokerProxyService)
      .useValue(brokerProxyServiceMock)
      .compile();

    controller = module.get<BrokerProxyController>(BrokerProxyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get()', () => {
    it('should log URL idp called and call allRequest private method', async () => {
      // Given
      controller['allRequest'] = jest.fn();

      // When
      await controller.get(reqMock, headersMock, resMock);

      // Then
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        'GET https://url.com/fizz',
      );
      expect(controller['allRequest']).toHaveBeenCalledTimes(1);
      expect(controller['allRequest']).toHaveBeenCalledWith(
        reqMock,
        headersMock,
        resMock,
      );
    });
  });

  describe('post()', () => {
    it('should log URL idp called', async () => {
      // Given
      controller['allRequest'] = jest.fn();

      // When
      await controller.post(reqMock, headersMock, resMock, bodyMock);

      // Then
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        'POST https://url.com/fizz',
      );
    });
  });

  describe('allRequest()', () => {
    it('should call broker proxy service without body', async () => {
      // Given
      reqMock.method = 'GET';

      brokerProxyServiceMock.proxyRequest.mockReturnValueOnce({
        headers: {
          fizz: 'bud',
        },
        status: 200,
        data: {
          foo: 'bar',
        },
      });

      resMock.status.mockReturnValue(sendMock);

      // When
      await controller['allRequest'](reqMock, headersMock, resMock);

      // Then
      expect(brokerProxyServiceMock.proxyRequest).toHaveBeenCalledTimes(1);
      expect(brokerProxyServiceMock.proxyRequest).toHaveBeenCalledWith(
        '/fizz',
        'GET',
        { host: 'url.com', 'x-forwarded-proto': 'https' },
        undefined,
      );
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(sendMock.send).toHaveBeenCalledTimes(1);
      expect(sendMock.send).toHaveBeenCalledWith({
        foo: 'bar',
      });
    });

    it('should call broker proxy service with a body', async () => {
      // Given
      reqMock.method = 'POST';

      brokerProxyServiceMock.proxyRequest.mockReturnValueOnce({
        headers: {
          fizz: 'bud',
        },
        status: 200,
        data: {
          // oidc variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          access_token: 'access_token',
          // oidc variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token: 'id_token',
          // oidc variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          token_type: 'token_type',
        },
      });

      resMock.status.mockReturnValue(sendMock);

      // When
      await controller.post(reqMock, headersMock, resMock, bodyMock);

      // Then
      expect(brokerProxyServiceMock.proxyRequest).toHaveBeenCalledTimes(1);
      expect(brokerProxyServiceMock.proxyRequest).toHaveBeenCalledWith(
        '/fizz',
        'POST',
        { host: 'url.com', 'x-forwarded-proto': 'https' },
        'foo=bar&toto=titi',
      );
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(sendMock.send).toHaveBeenCalledTimes(1);
      expect(sendMock.send).toHaveBeenCalledWith({
        // oidc variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        access_token: 'access_token',
        // oidc variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id_token: 'id_token',
        // oidc variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        token_type: 'token_type',
      });
    });
  });
});
