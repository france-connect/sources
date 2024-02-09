import { Test, TestingModule } from '@nestjs/testing';

import {
  BridgeError,
  BridgeProtocol,
  BridgeResponse,
  MessageType,
} from '@fc/hybridge-http-proxy';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { BridgePayloadDto } from '../dto';
import { CsmrHttpProxyService } from '../services';
import { CsmrHttpProxyController } from './csmr-http-proxy.controller';

describe('CsmrHttpProxyController', () => {
  let csmrHttpProxyController: CsmrHttpProxyController;

  const loggerMock = getLoggerMock();

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
      // Arrange
      // Action
      // Assert
      expect(csmrHttpProxyController).toBeDefined();
    });

    describe('proxyRequest()', () => {
      const baseBridgePayloadMock: BridgePayloadDto = Object.freeze({
        url: 'https://test.com/getToken',
        method: 'get',
        headers: {
          test: 'world',
        },
        data: null,
      } as unknown as BridgePayloadDto);

      it('should get the data from external service without data params', async () => {
        // Arrange
        const payload: BridgePayloadDto = {
          ...baseBridgePayloadMock,
        };

        const dataMock = {
          status: 200,
          data: null,
          statusText: 'Success',
          headers: {
            'content-type': 'text/html; charset=UTF-8',
          },
        };

        const resultMock: BridgeProtocol<BridgeResponse> = {
          type: MessageType.DATA,
          data: {
            status: 200,
            data: null,
            statusText: 'Success',
            headers: {
              'content-type': 'text/html; charset=UTF-8',
            },
          },
        };
        csmrHttpProxyMock.forwardRequest.mockResolvedValueOnce(dataMock);

        // Action
        const result = await csmrHttpProxyController.proxyRequest(payload);
        // Assert
        expect(result).toStrictEqual(resultMock);
      });

      it('should get the data from external ressources with data params', async () => {
        // Arrange
        const payload: BridgePayloadDto = {
          ...baseBridgePayloadMock,
          method: 'post',
          data: '{"sarah":"connor"}',
        };

        const dataMock = {
          status: 200,
          statusText: 'Success',
          headers: {
            'content-type': 'text/html; charset=UTF-8',
          },
          data: "{\nhello: 'world'\n}",
        };

        const resultMock: BridgeProtocol<BridgeResponse> = {
          type: MessageType.DATA,
          data: {
            status: 200,
            statusText: 'Success',
            headers: {
              'content-type': 'text/html; charset=UTF-8',
            },
            data: "{\nhello: 'world'\n}",
          },
        };
        csmrHttpProxyMock.forwardRequest.mockResolvedValueOnce(dataMock);
        // Action
        const result = await csmrHttpProxyController.proxyRequest(payload);
        // Assert
        expect(result).toStrictEqual(resultMock);
      });

      it('should fail to get the data from external ressource with unknown error', async () => {
        const errorMock = new Error('Unknown Error');

        csmrHttpProxyMock.forwardRequest.mockImplementationOnce(() => {
          throw errorMock;
        });
        // Arrange
        const payload = {
          url: 'https://test.com/getToken',
          method: 'post',
          headers: {
            test: 'world',
          },
          data: '{"sarah":"connor"}',
        } as unknown as BridgePayloadDto;

        const resultMock: BridgeProtocol<BridgeError> = {
          type: MessageType.ERROR,
          data: {
            name: 'Error',
            reason: 'Unknown Error',
            code: 1000,
          },
        };

        // Action
        const result = await csmrHttpProxyController.proxyRequest(payload);

        // Assert
        expect(result).toStrictEqual(resultMock);

        expect(loggerMock.err).toHaveBeenCalledTimes(1);
      });
    });
  });
});
