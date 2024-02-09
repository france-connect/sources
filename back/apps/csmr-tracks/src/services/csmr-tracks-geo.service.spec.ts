import { Test, TestingModule } from '@nestjs/testing';

import { GeoipMaxmindService } from '@fc/geoip-maxmind';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { ICsmrTracksData, ICsmrTracksV2FieldsData } from '../interfaces';
import { CsmrTracksGeoService } from './csmr-tracks-geo.service';

describe('CsmrTracksGeoService', () => {
  let service: CsmrTracksGeoService;

  const loggerMock = getLoggerMock();

  const geoipMaxmindServiceMock = {
    getCityName: jest.fn(),
    getCountryIsoCode: jest.fn(),
  };

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrTracksGeoService, LoggerService, GeoipMaxmindService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(GeoipMaxmindService)
      .useValue(geoipMaxmindServiceMock)
      .compile();

    service = module.get<CsmrTracksGeoService>(CsmrTracksGeoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGeoFromIp()', () => {
    beforeEach(() => {
      service['getIp'] = jest.fn().mockImplementation(({ ip }) => ip);
    });

    it('should return country and city from geopoint data', () => {
      // Given
      const sourceMock = {
        source: {
          geo: {
            // Input data
            // eslint-disable-next-line @typescript-eslint/naming-convention
            city_name: 'Paris',
            // Input data
            // eslint-disable-next-line @typescript-eslint/naming-convention
            country_iso_code: 'FR',
            // Input data
            // eslint-disable-next-line @typescript-eslint/naming-convention
            region_name: 'Ile-de-France',
          },
        },
      } as unknown as ICsmrTracksData;

      const resultMock = {
        country: 'FR',
        city: 'Paris',
      };
      // When
      const geoIp = service.getGeoFromIp(sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(0);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(0);
    });

    it('should return country and city from geopoint data even if city_name is not defined', () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
        source: {
          geo: {
            // Input data
            // eslint-disable-next-line @typescript-eslint/naming-convention
            city_name: undefined,
            // Input data
            // eslint-disable-next-line @typescript-eslint/naming-convention
            country_iso_code: 'FR',
            // Input data
            // eslint-disable-next-line @typescript-eslint/naming-convention
            region_name: 'Ile-de-France',
          },
        },
      } as unknown as ICsmrTracksData;

      const resultMock = {
        country: 'FR',
        city: 'Ile-de-France',
      };
      // When
      const geoIp = service.getGeoFromIp(sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(0);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(0);
    });

    it('should return country and city name from local database through geoip service', () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
      } as unknown as ICsmrTracksData;

      geoipMaxmindServiceMock.getCityName.mockReturnValueOnce('Paris');
      geoipMaxmindServiceMock.getCountryIsoCode.mockReturnValueOnce('FR');

      const resultMock = {
        country: 'FR',
        city: 'Paris',
      };
      // When
      const geoIp = service.getGeoFromIp(sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(1);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledWith(
        '172.16.156.25',
      );
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(1);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledWith(
        '172.16.156.25',
      );
    });

    it('should return undefined country and city name if geo data are empty', () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
        'source.geo.city_name': undefined,
        'source.geo.country_iso_code': undefined,
      } as unknown as ICsmrTracksData;

      geoipMaxmindServiceMock.getCityName.mockReturnValueOnce('Paris');
      geoipMaxmindServiceMock.getCountryIsoCode.mockReturnValueOnce('FR');

      const resultMock = {
        country: 'FR',
        city: 'Paris',
      };
      // When
      const geoIp = service.getGeoFromIp(sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(1);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledWith(
        '172.16.156.25',
      );
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(1);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledWith(
        '172.16.156.25',
      );
    });

    it('should return undefined country and city name if geoip service return undefined variable', () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
      } as unknown as ICsmrTracksData;

      geoipMaxmindServiceMock.getCityName.mockReturnValueOnce(undefined);
      geoipMaxmindServiceMock.getCountryIsoCode.mockReturnValueOnce(undefined);

      const resultMock = {
        country: undefined,
        city: undefined,
      };
      // When
      const geoIp = service.getGeoFromIp(sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(1);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledWith(
        '172.16.156.25',
      );
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(1);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledWith(
        '172.16.156.25',
      );
    });
  });

  describe('getIp', () => {
    it('should return ip from high fields', () => {
      // Given
      const trackMock = {
        ip: 'ipHigh',
      } as unknown as ICsmrTracksV2FieldsData;
      // When
      const ip = service['getIp'](trackMock);

      // Then
      expect(ip).toEqual('ipHigh');
    });

    it('should return ip from legacy fields', () => {
      // Given
      const trackMock = {
        userIp: 'ipLegacy',
      } as unknown as ICsmrTracksV2FieldsData;
      // When
      const ip = service['getIp'](trackMock);

      // Then
      expect(ip).toEqual('ipLegacy');
    });
  });
});
