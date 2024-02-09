import { lastValueFrom } from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { BridgeHttpProxyProtocolDto } from '../dto';
import {
  BridgeHttpProxyMissingVariableException,
  BridgeHttpProxyRabbitmqException,
} from '../exceptions';
import { BridgeHttpProxyService } from './bridge-http-proxy.service';

jest.mock('rxjs');
jest.mock('@fc/common');

describe('BridgeHttpProxyService', () => {
  let service: BridgeHttpProxyService;

  const loggerServiceMock = getLoggerMock();

  const configMock = {
    get: jest.fn(),
  };

  const brokerMock = {
    send: jest.fn(),
  };

  const messageMock = {
    pipe: jest.fn(),
  };

  const brokerResponseMock = 'brokerResponseMock';

  const originalUrlMock = '/bizz/bud';
  const headersMock = {
    host: 'foo.fr',
    'x-forwarded-proto': 'https',
  };

  const axiosResponseResolvedMock = {
    headers: { host: 'host' },
    data: 'foo',
    status: 200,
  };

  const validatorOptions = {
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    skipMissingProperties: false,
    whitelist: true,
  };

  let lastValueMock;
  let validateDtoMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BridgeHttpProxyService,
        LoggerService,
        ConfigService,
        {
          provide: 'BridgeProxyBroker',
          useValue: brokerMock,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<BridgeHttpProxyService>(BridgeHttpProxyService);

    configMock.get.mockReturnValueOnce({
      requestTimeout: 6000,
    });

    lastValueMock = jest.mocked(lastValueFrom);
    validateDtoMock = jest.mocked(validateDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('proxyRequest', () => {
    const method = 'GET';

    describe('', () => {
      beforeEach(() => {
        // Given
        brokerMock.send.mockReturnValue(messageMock);
        messageMock.pipe.mockReturnValue(brokerResponseMock);
        lastValueMock.mockResolvedValueOnce(axiosResponseResolvedMock);
        validateDtoMock.mockResolvedValueOnce([]);
      });

      it('should call once createMessage() private method', async () => {
        // Given
        service['createMessage'] = jest.fn();

        const bodyMock = 'toto=titi';

        // When
        await service.proxyRequest(
          originalUrlMock,
          method,
          headersMock,
          bodyMock,
        );

        // Then
        expect(service['createMessage']).toHaveBeenCalledTimes(1);
        expect(service['createMessage']).toHaveBeenCalledWith(
          originalUrlMock,
          'GET',
          {
            host: 'foo.fr',
            'x-forwarded-proto': 'https',
          },
          'toto=titi',
        );
      });

      it('should validate the format of the identity received from broker thanks to the dto', async () => {
        // When
        await service.proxyRequest(originalUrlMock, method, headersMock);

        // Then
        expect(validateDtoMock).toHaveBeenCalledTimes(1);
        expect(validateDtoMock).toHaveBeenCalledWith(
          axiosResponseResolvedMock,
          BridgeHttpProxyProtocolDto,
          validatorOptions,
        );
      });

      it('should return result received from broker', async () => {
        // Given
        const expected = {
          headers: { host: 'host' },
          data: 'foo',
          status: 200,
        };

        // When
        const result = await service.proxyRequest(
          originalUrlMock,
          method,
          headersMock,
        );

        // Then
        expect(result).toStrictEqual(expected);
      });
    });

    it('should throw an exception if data are missing', async () => {
      // Given
      const axiosResponseResolvedMock = {
        headers: { host: 'host' },
        status: 200,
      };

      brokerMock.send.mockReturnValue(messageMock);
      messageMock.pipe.mockReturnValue(brokerResponseMock);
      lastValueMock.mockResolvedValueOnce(axiosResponseResolvedMock);
      validateDtoMock.mockResolvedValueOnce([{ property: 'invalid param' }]);

      // When / Then
      await expect(
        service.proxyRequest(originalUrlMock, method, headersMock),
      ).rejects.toThrow(BridgeHttpProxyMissingVariableException);
    });

    it('should throw an exception if an error occurs when calling the broker', async () => {
      // Given
      brokerMock.send.mockReturnValue(messageMock);
      messageMock.pipe.mockReturnValue(brokerResponseMock);
      lastValueMock.mockRejectedValue({
        message: 'error message',
        status: 400,
      });
      validateDtoMock.mockResolvedValueOnce([]);

      // When / Then
      await expect(
        service.proxyRequest(originalUrlMock, method, headersMock),
      ).rejects.toThrow(BridgeHttpProxyRabbitmqException);
    });
  });

  describe('createMessage', () => {
    it('should prepare and create message for the broker call', () => {
      // Given
      const method = 'GET';
      const bodyMock = 'toto=titi';

      const expected = {
        headers: {
          host: 'foo.fr',
          'x-forwarded-proto': 'https',
        },
        method: 'GET',
        data: 'toto=titi',
        url: 'https://foo.fr/bizz/bud',
      };

      // When
      const result = service['createMessage'](
        originalUrlMock,
        method,
        headersMock,
        bodyMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should prepare and create message for the broker call, even if body is an empty object', () => {
      // Given
      const method = 'POST';

      const expected = {
        data: undefined,
        headers: {
          host: 'foo.fr',
          'x-forwarded-proto': 'https',
        },
        method: 'POST',
        url: 'https://foo.fr/bizz/bud',
      };

      // When
      const result = service['createMessage'](
        originalUrlMock,
        method,
        headersMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });
  });

  describe('setHeaders', () => {
    it('should set headers value', () => {
      // Given
      const resMock = {
        set: jest.fn(),
      };

      // When
      service.setHeaders(resMock, headersMock);

      // Then
      expect(resMock.set).toHaveBeenCalledTimes(2);
      expect(resMock.set).toHaveBeenCalledWith('host', 'foo.fr');
      expect(resMock.set).toHaveBeenCalledWith('x-forwarded-proto', 'https');
    });
  });
});
