import { City, Reader, ReaderModel } from '@maxmind/geoip2-node';
import { mocked } from 'jest-mock';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { GeoipMaxmindNotFoundException } from './exceptions';
import { GeoipMaxmindService } from './geoip-maxmind.service';

jest.mock('@maxmind/geoip2-node');

describe('GeoipMaxmindService', () => {
  let service: GeoipMaxmindService;
  let readerMock;

  const errorMock = 'An error occured';
  const ipMock = '123';

  const configServiceMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
  } as unknown as LoggerService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService, GeoipMaxmindService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<GeoipMaxmindService>(GeoipMaxmindService);

    readerMock = mocked(Reader);
    service['db'] = { city: jest.fn() } as unknown as ReaderModel;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit()', () => {
    it('should call loadDatabase', async () => {
      // Given
      service['loadDatabase'] = jest.fn();

      // When
      await service.onModuleInit();

      // Then
      expect(service['loadDatabase']).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadDatabase()', () => {
    it('should retrieve the database info for local base', async () => {
      // Given
      configServiceMock.get.mockReturnValue({ path: '/foo' });
      readerMock.open.mockResolvedValue({});

      // When
      await service.loadDatabase();

      // Then
      expect(readerMock.open).toBeCalledTimes(1);
      expect(loggerServiceMock.trace).toBeCalledTimes(0);
      expect(readerMock.open).toHaveBeenCalledWith('/foo');
    });

    it('should throw if an error occurs when we try to retrieve the database location', async () => {
      // Given
      configServiceMock.get.mockReturnValue({ path: '/foo' });
      readerMock.open.mockRejectedValue(errorMock);

      // When / Then
      await expect(service.loadDatabase()).rejects.toThrow(
        GeoipMaxmindNotFoundException,
      );
      expect(readerMock.open).toBeCalledTimes(1);
      expect(loggerServiceMock.trace).toBeCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledWith('An error occured');
    });
  });

  describe('getCityName()', () => {
    it('should retrieve city name from "fr" object city name', async () => {
      // Given
      const dataGeoipMock = {
        city: { names: { fr: 'Fizz' } },
      } as unknown as City;
      mocked(service['db'].city).mockReturnValue(dataGeoipMock);

      // When
      const result = service.getCityName(ipMock);

      // Then
      expect(result).toStrictEqual('Fizz');
    });

    it('should retrieve city name from "en" object city name', async () => {
      // Given
      const dataGeoipMock = {
        city: { names: { en: 'Buz' } },
      } as unknown as City;
      mocked(service['db'].city).mockReturnValue(dataGeoipMock);

      // When
      const result = service.getCityName(ipMock);

      // Then
      expect(result).toStrictEqual('Buz');
    });

    it('should return undefined city name if no name found', async () => {
      // Given
      const dataGeoipMock = {
        city: { names: { pt: 'Foo' } },
      } as unknown as City;
      mocked(service['db'].city).mockReturnValue(dataGeoipMock);

      // When
      const result = service.getCityName(ipMock);

      // Then
      expect(result).toStrictEqual(undefined);
    });

    it('should return undefined city name if an error occurs', () => {
      // When
      const result = service.getCityName(ipMock);

      // Then
      expect(result).toStrictEqual(undefined);
      expect(loggerServiceMock.trace).toBeCalledTimes(1);
    });
  });

  describe('getCountryIsoCode()', () => {
    it('should retrieve country iso code', async () => {
      // Given
      const dataGeoipMock = {
        country: { isoCode: 'FR' },
      } as unknown as City;
      mocked(service['db'].city).mockReturnValue(dataGeoipMock);

      // When
      const result = service.getCountryIsoCode(ipMock);

      // Then
      expect(result).toStrictEqual('FR');
    });

    it('should return undefined country iso code if no one found', async () => {
      // Given
      const dataGeoipMock = {
        country: 'FR',
      } as unknown as City;
      mocked(service['db'].city).mockReturnValue(dataGeoipMock);

      // When
      const result = service.getCountryIsoCode(ipMock);

      // Then
      expect(result).toStrictEqual(undefined);
    });

    it('should return undefined country iso code if an error occurs', () => {
      // When
      const result = service.getCountryIsoCode(ipMock);

      // Then
      expect(result).toStrictEqual(undefined);
      expect(loggerServiceMock.trace).toBeCalledTimes(1);
    });
  });
});
