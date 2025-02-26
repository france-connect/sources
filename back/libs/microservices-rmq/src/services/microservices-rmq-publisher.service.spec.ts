import { lastValueFrom, timeout } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';

import { FSA, FSAMeta, getValidDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { ResponseStatus } from '../enums';
import {
  MicroservicesRmqCommunicationException,
  MicroservicesRmqResponseException,
  MicroservicesRmqResponseNoPayloadException,
  MicroservicesRmqValidationException,
} from '../exceptions';
import { getServiceToken } from '../helpers';
import { MicroservicesRmqPublisherService } from './microservices-rmq-publisher.service';

jest.mock('rxjs');
jest.mock('@fc/common');
jest.mock('../helpers');

describe('MicroservicesRmqPublisherService', () => {
  let service: MicroservicesRmqPublisherService;

  const timeoutMock = jest.mocked(timeout);
  const lastValueFromMock = jest.mocked(lastValueFrom);
  const getServiceTokenMock = jest.mocked(getServiceToken);
  const getValidDtoMock = jest.mocked(getValidDto);

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const brokerMock = {
    send: jest.fn(),
    pipe: jest.fn(),
  };
  const serviceNameMock = 'Test';

  const configDataMock = {
    requestTimeout: 42,
  };

  const commandMock = 'CommandMock';
  class MessageMock {}
  class ResponseDtoMock implements FSA {
    type: ResponseStatus;
    payload: unknown;
    meta: FSAMeta;
  }
  const payloadMock = new MessageMock();
  const validationOptionsMock = {};

  const resultMock = {
    type: ResponseStatus.SUCCESS,
    payload: {},
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    service = new MicroservicesRmqPublisherService(
      configMock as unknown as ConfigService,
      loggerMock as unknown as LoggerService,
      brokerMock as unknown as ClientProxy,
      serviceNameMock,
    );

    getServiceTokenMock.mockReturnValue(serviceNameMock);
    configMock.get.mockReturnValue(configDataMock);
    brokerMock.send.mockReturnThis();
    lastValueFromMock.mockResolvedValue(resultMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publish', () => {
    beforeEach(() => {
      service['getSuccess'] = jest.fn();
      service['getValidatedResponse'] = jest.fn();
    });

    it('should send a message with command and payload', async () => {
      // When
      await service.publish<MessageMock, ResponseDtoMock>(
        commandMock,
        payloadMock,
        ResponseDtoMock,
        validationOptionsMock,
      );

      // Then
      expect(brokerMock.send).toHaveBeenCalledExactlyOnceWith(
        commandMock,
        payloadMock,
      );
    });

    it('should use the timeout from configuration', async () => {
      // When
      await service.publish<MessageMock, ResponseDtoMock>(
        commandMock,
        payloadMock,
        ResponseDtoMock,
        validationOptionsMock,
      );

      // Then
      expect(timeoutMock).toHaveBeenCalledExactlyOnceWith(
        configDataMock.requestTimeout,
      );
    });

    it('should throw a MicroservicesRmqResponseException if the result is a failure', async () => {
      // Given
      const errorMock = {
        type: ResponseStatus.FAILURE,
        payload: {
          foo: 'bar',
        },
      };

      brokerMock.send.mockImplementationOnce(() => {
        throw errorMock;
      });

      // Then / When
      await expect(
        service.publish<MessageMock, ResponseDtoMock>(
          commandMock,
          payloadMock,
          ResponseDtoMock,
          validationOptionsMock,
        ),
      ).rejects.toThrow(MicroservicesRmqResponseException);
    });

    it('should throw a MicroservicesRmqCommunicationException', async () => {
      // Given
      brokerMock.send.mockImplementationOnce(() => {
        throw new Error();
      });

      // Then / When
      await expect(
        service.publish<MessageMock, ResponseDtoMock>(
          commandMock,
          payloadMock,
          ResponseDtoMock,
          validationOptionsMock,
        ),
      ).rejects.toThrow(MicroservicesRmqCommunicationException);
    });

    it('should check for success', async () => {
      // When
      await service.publish<MessageMock, ResponseDtoMock>(
        commandMock,
        payloadMock,
        ResponseDtoMock,
        validationOptionsMock,
      );

      // Then
      expect(service['getSuccess']).toHaveBeenCalledExactlyOnceWith(resultMock);
    });

    it('should return validated dto', async () => {
      // Given
      const validDtoMock = Symbol('validDto') as any;
      service['getValidatedResponse'] = jest
        .fn()
        .mockResolvedValue(validDtoMock);

      // When
      const result = await service.publish<MessageMock, ResponseDtoMock>(
        commandMock,
        payloadMock,
        ResponseDtoMock,
        validationOptionsMock,
      );

      expect(result).toBe(validDtoMock);
    });
  });

  describe('getValidatedResponse', () => {
    it('should return the result if no dto is provided', async () => {
      // When
      const result = await service['getValidatedResponse'](resultMock);

      // Then
      expect(result).toBe(resultMock);
    });

    it('should return the transformed result', async () => {
      // Given
      const validatedMock = Symbol('validated') as any;
      getValidDtoMock.mockResolvedValue(validatedMock);

      // When
      const result = await service['getValidatedResponse'](
        resultMock,
        ResponseDtoMock,
        validationOptionsMock,
      );

      // Then
      expect(result).toBe(validatedMock);
    });

    it('should throw a MicroservicesRmqValidationException if valid returns an array', async () => {
      // Given
      getValidDtoMock.mockResolvedValue([Symbol('error')] as any);

      // Then / When
      await expect(
        service['getValidatedResponse'](
          resultMock,
          ResponseDtoMock,
          validationOptionsMock,
        ),
      ).rejects.toThrow(MicroservicesRmqValidationException);
    });
  });

  describe('getSuccess', () => {
    it('should return the result if it is a success', () => {
      // When
      const result = service['getSuccess'](resultMock);

      // Then
      expect(result).toBe(resultMock);
    });

    it('should throw a MicroservicesRmqResponseNoPayloadException had no payload', () => {
      // Given
      const noPayloadMock = {
        type: ResponseStatus.SUCCESS,
      };

      // Then / When
      expect(() => service['getSuccess'](noPayloadMock)).toThrow(
        MicroservicesRmqResponseNoPayloadException,
      );
    });
  });
});
