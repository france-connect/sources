import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { BridgePayloadDto } from '../dto';
import { CsmrHttpProxyService } from '../services';
import { CsmrHttpProxyController } from './csmr-http-proxy.controller';

describe('CsmrHttpProxyController', () => {
  let csmrHttpProxyController: CsmrHttpProxyController;

  const loggerMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  };

  const csmrHttpProxyMock = {
    forwardRequest: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrHttpProxyController],
      providers: [LoggerService, CsmrHttpProxyService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CsmrHttpProxyService)
      .useValue(csmrHttpProxyMock)
      .compile();

    csmrHttpProxyController = app.get<CsmrHttpProxyController>(
      CsmrHttpProxyController,
    );
  });

  describe('CsmHttpProxyController', () => {
    it('should get the controller defined', () => {
      expect(csmrHttpProxyController).toBeDefined();
      expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
      expect(loggerMock.setContext).toHaveBeenCalledWith(
        'CsmrHttpProxyController',
      );
    });

    describe('computeRequest()', () => {
      it('should get the token from FI by GET request', async () => {
        // Arrange
        const payload: BridgePayloadDto = {
          url: 'https://test.com/getToken',
          method: 'get',
          headers: {
            test: 'world',
          },
          data: null,
        };

        const resultMock = {
          status: 200,
          data: null,
          message: 'Success',
          headers: {
            'content-type': 'text/html; charset=UTF-8',
          },
        };
        csmrHttpProxyMock.forwardRequest.mockResolvedValueOnce(resultMock);

        // Action
        const result = await csmrHttpProxyController.proxyRequest(payload);
        // Assert
        expect(result).toStrictEqual(resultMock);
      });

      it('should get the token from FI by POST request', async () => {
        // Arrange
        const payload: BridgePayloadDto = {
          url: 'https://test.com/getToken',
          method: 'post',
          headers: {
            test: 'world',
          },
          data: {
            sarah: 'connor',
          },
        };
        const resultMock = {
          status: 200,
          message: 'Success',
          headers: {
            'content-type': 'text/html; charset=UTF-8',
          },
          data: {
            hello: 'world',
          },
        };
        csmrHttpProxyMock.forwardRequest.mockResolvedValueOnce(resultMock);
        // Action
        const result = await csmrHttpProxyController.proxyRequest(payload);
        // Assert
        expect(result).toStrictEqual(resultMock);
      });

      /**
       * @todo
       * this test must be killed when fakeCall disappear
       *
       * Author: Arnaud PSA
       * Date: 26/10/21
       */
      it('should failed to get the token from FI', async () => {
        const errorMock = new Error('Unknown Error');
        csmrHttpProxyMock.forwardRequest.mockImplementationOnce(() => {
          throw errorMock;
        });
        // Arrange
        const payload: BridgePayloadDto = {
          url: 'https://test.com/getToken',
          method: 'post',
          headers: {
            test: 'world',
          },
          data: {
            sarah: 'connor',
          },
        };

        // Action
        const result = await csmrHttpProxyController.proxyRequest(payload);

        // Assert
        expect(result).toStrictEqual({ message: 'Unknown Error', status: 500 });
        expect(loggerMock.error).toHaveBeenCalledTimes(1);
        expect(loggerMock.error).toHaveBeenCalledWith(errorMock);
      });
    });
  });
});
