import { ValidationError } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { MessageType } from '@fc/hybridge-http-proxy';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import {
  BridgeHttpProxyCsmrException,
  BridgeHttpProxyMissingVariableException,
} from '../exceptions';
import { BridgeHttpProxyService } from '../services';
import { BridgeHttpProxyController } from './bridge-http-proxy.controller';

jest.mock('@fc/common');

describe('BrokerProxyController', () => {
  let controller: BridgeHttpProxyController;

  const bridgeHttpProxyServiceMock = {
    proxyRequest: jest.fn(),
    setHeaders: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();

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
      controllers: [BridgeHttpProxyController],
      providers: [LoggerService, BridgeHttpProxyService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(BridgeHttpProxyService)
      .useValue(bridgeHttpProxyServiceMock)
      .compile();

    controller = module.get<BridgeHttpProxyController>(
      BridgeHttpProxyController,
    );
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
      expect(controller['allRequest']).toHaveBeenCalledTimes(1);
      expect(controller['allRequest']).toHaveBeenCalledWith(
        reqMock,
        headersMock,
        resMock,
      );
    });
  });

  describe('post()', () => {
    it('should log URL idp called and call allRequest private method', async () => {
      // Given
      controller['allRequest'] = jest.fn();

      // When
      await controller.get(reqMock, headersMock, resMock);

      // Then
      expect(controller['allRequest']).toHaveBeenCalledTimes(1);
      expect(controller['allRequest']).toHaveBeenCalledWith(
        reqMock,
        headersMock,
        resMock,
      );
    });
  });

  describe('allRequest()', () => {
    let handleMessageMock;
    let handleErrorMock;

    beforeEach(() => {
      handleMessageMock = jest.spyOn<BridgeHttpProxyController, any>(
        controller,
        'handleMessage',
      );
      handleMessageMock.mockResolvedValueOnce();
      handleErrorMock = jest.spyOn<BridgeHttpProxyController, any>(
        controller,
        'handleError',
      );
      handleErrorMock.mockResolvedValueOnce();
    });

    it('should log URL idp called', async () => {
      // Given
      reqMock.method = 'GET';
      bridgeHttpProxyServiceMock.proxyRequest.mockResolvedValueOnce({
        type: MessageType.DATA,
        data: {
          headers: {
            fizz: 'bud',
          },
          status: 200,
          data: {
            foo: 'bar',
          },
        },
      });

      // When
      await controller['allRequest'](reqMock, headersMock, resMock);

      // Then
      expect(loggerServiceMock.info).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.info).toHaveBeenCalledWith(
        'GET https://url.com/fizz',
      );
    });

    it('should call broker proxy service without body', async () => {
      // Given
      reqMock.method = 'GET';

      bridgeHttpProxyServiceMock.proxyRequest.mockResolvedValueOnce({
        type: MessageType.DATA,
        data: {
          headers: {
            fizz: 'bud',
          },
          status: 200,
          data: {
            foo: 'bar',
          },
        },
      });

      // When
      await controller['allRequest'](reqMock, headersMock, resMock);

      // Then
      expect(bridgeHttpProxyServiceMock.proxyRequest).toHaveBeenCalledTimes(1);
      expect(bridgeHttpProxyServiceMock.proxyRequest).toHaveBeenCalledWith(
        '/fizz',
        'GET',
        { host: 'url.com', 'x-forwarded-proto': 'https' },
        undefined,
      );

      expect(handleMessageMock).toHaveBeenCalledTimes(1);
      expect(handleErrorMock).toHaveBeenCalledTimes(0);
      expect(handleMessageMock).toHaveBeenCalledWith(resMock, {
        data: { foo: 'bar' },
        headers: { fizz: 'bud' },
        status: 200,
      });
    });

    it('should call broker proxy service with a body', async () => {
      // Given
      reqMock.method = 'POST';

      bridgeHttpProxyServiceMock.proxyRequest.mockResolvedValueOnce({
        type: MessageType.DATA,
        data: {
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
        },
      });

      // When
      await controller.post(reqMock, headersMock, resMock, bodyMock);

      // Then
      expect(bridgeHttpProxyServiceMock.proxyRequest).toHaveBeenCalledTimes(1);
      expect(bridgeHttpProxyServiceMock.proxyRequest).toHaveBeenCalledWith(
        '/fizz',
        'POST',
        { host: 'url.com', 'x-forwarded-proto': 'https' },
        'foo=bar&toto=titi',
      );

      expect(handleMessageMock).toHaveBeenCalledTimes(1);
      expect(handleErrorMock).toHaveBeenCalledTimes(0);
      expect(handleMessageMock).toHaveBeenCalledWith(resMock, {
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
    });

    it('should call Error handler if the request failed on external resource', async () => {
      // Given
      reqMock.method = 'POST';

      bridgeHttpProxyServiceMock.proxyRequest.mockResolvedValueOnce({
        type: MessageType.ERROR,
        data: {
          code: 1000,
          name: 'UnknownBrokerError',
          reason: 'Something weird happened and I do not know why',
        },
      });

      // When
      await controller.post(reqMock, headersMock, resMock, bodyMock);

      // Then
      expect(bridgeHttpProxyServiceMock.proxyRequest).toHaveBeenCalledTimes(1);
      expect(bridgeHttpProxyServiceMock.proxyRequest).toHaveBeenCalledWith(
        '/fizz',
        'POST',
        { host: 'url.com', 'x-forwarded-proto': 'https' },
        'foo=bar&toto=titi',
      );

      expect(handleMessageMock).toHaveBeenCalledTimes(0);
      expect(handleErrorMock).toHaveBeenCalledTimes(1);
      expect(handleErrorMock).toHaveBeenCalledWith({
        code: 1000,
        name: 'UnknownBrokerError',
        reason: 'Something weird happened and I do not know why',
      });
    });
  });

  describe('handleMessage()', () => {
    const validateDtoMock = jest.mocked(validateDto);

    it('should return HTTP message with headers from broker', async () => {
      // Given
      const correctMessage = {
        headers: {
          fizz: 'bud',
          test: 'testValue',
        },
        status: 200,
        data: null,
      };
      validateDtoMock.mockResolvedValueOnce([
        /* No error */
      ]);
      resMock.status.mockReturnValue(sendMock);

      // When
      await controller.handleMessage(resMock, correctMessage);

      // Then
      expect(bridgeHttpProxyServiceMock.setHeaders).toHaveBeenCalledTimes(1);
      expect(bridgeHttpProxyServiceMock.setHeaders).toHaveBeenCalledWith(
        resMock,
        correctMessage.headers,
      );
    });
    it('should return HTTP message from broker message', async () => {
      // Given
      const correctMessage = {
        headers: {
          fizz: 'bud',
        },
        status: 200,
        data: {
          foo: 'bar',
        },
      };
      validateDtoMock.mockResolvedValueOnce([
        /* No error */
      ]);
      resMock.status.mockReturnValue(sendMock);

      // When
      await controller.handleMessage(resMock, correctMessage);

      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(sendMock.send).toHaveBeenCalledTimes(1);
      expect(sendMock.send).toHaveBeenCalledWith({
        foo: 'bar',
      });
    });
    it('should fail to return HTTP message from broker message', async () => {
      // Given
      const falsyMessage = {
        Sarah: 'Connor',
      };

      validateDtoMock.mockResolvedValueOnce([
        new Error('Unknown Error') as unknown as ValidationError,
      ]);
      // When
      await expect(
        controller.handleMessage(resMock, falsyMessage),
        // Then
      ).rejects.toThrow(BridgeHttpProxyMissingVariableException);
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
      expect(bridgeHttpProxyServiceMock.setHeaders).toHaveBeenCalledTimes(0);
    });
  });

  describe('handleError()', () => {
    const validateDtoMock = jest.mocked(validateDto);

    it('should throw format Error if Error message from Broker is miss formatted', async () => {
      // Given
      const falsyError = {
        Sarah: 'Connor',
      };

      validateDtoMock.mockResolvedValueOnce([
        new Error('Unknown Error') as unknown as ValidationError,
      ]);
      // When
      await expect(
        controller.handleError(falsyError),
        // Then
      ).rejects.toThrow(BridgeHttpProxyMissingVariableException);
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
    });

    it('should fail to return HTTP message from broker message', async () => {
      // Given
      const successError = {
        code: 1000,
        name: 'ErrorName',
        reason: 'Nice try M. Bond !',
      };

      validateDtoMock.mockResolvedValueOnce([
        /* No error */
      ]);
      // When
      await expect(
        controller.handleError(successError),
        // Then
      ).rejects.toThrow(BridgeHttpProxyCsmrException);
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
    });
  });
});
