import { lastValueFrom } from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationOptions, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { TracksProtocol } from '@fc/microservices';
import { IOidcIdentity } from '@fc/oidc';

import { TrackDto } from '../dto';
import { TracksResponseException } from '../exceptions';
import { DTO_OPTIONS, TracksService } from './tracks.service';

jest.mock('rxjs');
jest.mock('@fc/common');

describe('TracksService', () => {
  let service: TracksService;

  const lastValueFromMock = jest.mocked(lastValueFrom);

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const identityMock = {} as IOidcIdentity;

  const configMock = {
    get: jest.fn(),
  };

  const brokerMock = {
    close: jest.fn(),
    connect: jest.fn(),
    send: jest.fn(),
  };

  const messageMock = {
    pipe: jest.fn(),
  };

  const pipeMock = {};
  const brokerResponseMock = 'brokerResponseMock';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TracksService,
        LoggerService,
        ConfigService,
        {
          provide: 'TracksBroker',
          useValue: brokerMock,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<TracksService>(TracksService);

    configMock.get.mockReturnValueOnce({
      payloadEncoding: 'base64',
      requestTimeout: 200,
    });

    brokerMock.send.mockReturnValue(messageMock);
    messageMock.pipe.mockReturnValue(pipeMock);
    lastValueFromMock.mockResolvedValue(brokerResponseMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    const optionsMock: IPaginationOptions = {
      offset: 12,
      size: 42,
    };
    let checkTracksMock;

    beforeEach(() => {
      checkTracksMock = jest.fn().mockResolvedValueOnce(null);
      service['checkTracks'] = checkTracksMock;
    });

    it('should return a promise', async () => {
      // When
      const result = service.getList(identityMock, optionsMock);
      // Then
      expect(result).toBeInstanceOf(Promise);
      await result;
    });

    it('should call config.get', async () => {
      // When
      await service.getList(identityMock, optionsMock);
      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith('TracksBroker');
    });

    it('should call broker.send with the user identity', async () => {
      // When
      await service.getList(identityMock, optionsMock);
      // Then
      expect(brokerMock.send).toHaveBeenCalledTimes(1);
      expect(brokerMock.send).toHaveBeenCalledWith(
        TracksProtocol.Commands.GET,
        {
          identity: identityMock,
          options: optionsMock,
        },
      );
    });

    it('should reject when the rabbitmq response has failed', async () => {
      // Given
      const rejectedValueMock = 'rejectedValueMock';
      lastValueFromMock.mockRejectedValueOnce(rejectedValueMock);
      // When / Then
      await expect(service.getList(identityMock, optionsMock)).rejects.toThrow(
        TracksResponseException,
      );
    });

    it('should resolve when the rabbitmq response is successful', async () => {
      // Given
      const resolvedValueMock = { meta: 'metaValue', payload: 'payloadValue' };
      lastValueFromMock.mockResolvedValueOnce(resolvedValueMock);
      // When
      const result = await service.getList(identityMock, optionsMock);
      // Then
      expect(result).toEqual(resolvedValueMock);
    });

    it('should reject when data validation failed', async () => {
      // Given
      const errorMock = 'Unknown Error';
      checkTracksMock.mockReset().mockResolvedValueOnce([errorMock]);

      await expect(
        // When
        service.getList(identityMock, optionsMock),
        // Then
      ).rejects.toThrow(TracksResponseException);
    });
  });

  describe('checkTracks()', () => {
    let validateDtoMock;
    beforeEach(() => {
      validateDtoMock = jest.mocked(validateDto);
    });

    it('should return null if data is correct', async () => {
      // Given
      const dataMock = [{ data: 'data1' }, { data: 'data2' }];

      validateDtoMock.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      // When
      const errors = await service['checkTracks'](dataMock);
      // Then
      expect(errors).toBeNull();
      expect(validateDtoMock).toHaveBeenCalledTimes(2);
      expect(validateDtoMock).toHaveBeenNthCalledWith(
        1,
        dataMock[0],
        TrackDto,
        DTO_OPTIONS,
      );
      expect(validateDtoMock).toHaveBeenNthCalledWith(
        2,
        dataMock[1],
        TrackDto,
        DTO_OPTIONS,
      );
    });

    it('should return errors if data failed check', async () => {
      // Given
      const dataMock = [{ data: 'data1' }, { data: 'data2' }];

      const errorMock = new Error('ValidationError');

      validateDtoMock
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([errorMock]);
      // When
      const errors = await service['checkTracks'](dataMock);
      // Then
      expect(errors).toStrictEqual([errorMock]);
    });
  });
});
