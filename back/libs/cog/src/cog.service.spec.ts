import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { CogService } from './cog.service';
import { CityInterface, CountryInterface } from './interfaces';
import { COG_CITY, COG_COUNTRY, COG_ISO_COUNTRY } from './tokens';

describe('CogService', () => {
  let service: CogService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const cityRepositoryMock = {
    find: jest.fn(),
    parse: jest.fn(),
    createIndex: jest.fn(),
    getByIndex: jest.fn(),
  };

  const countryRepositoryMock = {
    find: jest.fn(),
    parse: jest.fn(),
    createIndex: jest.fn(),
    getByIndex: jest.fn(),
  };

  const isoCogCountryRepositoryMock = {
    find: jest.fn(),
    parse: jest.fn(),
    createIndex: jest.fn(),
    getByIndex: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CogService,
        ConfigService,
        {
          provide: COG_CITY,
          useValue: cityRepositoryMock,
        },
        {
          provide: COG_COUNTRY,
          useValue: countryRepositoryMock,
        },
        {
          provide: COG_ISO_COUNTRY,
          useValue: isoCogCountryRepositoryMock,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<CogService>(CogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    const configMock = {
      [COG_CITY]: 'cogCityValue',
      [COG_COUNTRY]: 'cogCountryValue',
      [COG_ISO_COUNTRY]: 'cogIsoCountryValue',
    };

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce(configMock);
    });

    it('should retrieve the database source from the config', async () => {
      // When
      await service['onModuleInit']();

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('Cog');
    });

    it('should initialize the database with parsing file', async () => {
      // When
      await service['onModuleInit']();

      // Then
      expect(cityRepositoryMock.parse).toHaveBeenCalledTimes(1);
      expect(cityRepositoryMock.parse).toHaveBeenCalledWith(
        configMock[COG_CITY],
      );
      expect(countryRepositoryMock.parse).toHaveBeenCalledTimes(1);
      expect(countryRepositoryMock.parse).toHaveBeenCalledWith(
        configMock[COG_COUNTRY],
      );
      expect(isoCogCountryRepositoryMock.parse).toHaveBeenCalledTimes(1);
      expect(isoCogCountryRepositoryMock.parse).toHaveBeenCalledWith(
        configMock[COG_ISO_COUNTRY],
      );
    });

    it('should fail to init database if parsing failed', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      cityRepositoryMock.parse.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      await expect(
        service['onModuleInit'](),
        // Then
      ).rejects.toThrow(errorMock);
    });
  });

  describe('getLabelFromCog()', () => {
    const franceCog = '95220';
    const foreignCog = '99135';

    const cityMock: CityInterface = {
      com: franceCog,
      libelle: 'la meilleure ville du monde',
    };
    const countryMock: CountryInterface = {
      codeiso2: 'CB',
      cog: foreignCog,
      libcog: 'le meilleur pays du monde',
    };

    const labelFrMock = 'la meilleure ville du monde - 95220, FRANCE (FR)';
    const labelEuMock = 'le meilleur pays du monde (CB)';

    beforeEach(() => {
      cityRepositoryMock.getByIndex.mockReturnValueOnce(cityMock);
      countryRepositoryMock.getByIndex.mockReturnValueOnce(countryMock);
    });

    it('should transform French Cog to label with city', () => {
      // When
      const result = service.getLabelFromCog(franceCog);

      // Then
      expect(result).toEqual(labelFrMock);

      expect(cityRepositoryMock.getByIndex).toHaveBeenCalledTimes(1);
      expect(cityRepositoryMock.getByIndex).toHaveBeenCalledWith(
        'com',
        franceCog,
      );

      expect(countryRepositoryMock.getByIndex).toHaveBeenCalledTimes(0);
    });

    it('should transform foreign cog to label with Country', () => {
      // When
      const result = service.getLabelFromCog(foreignCog);

      // Then
      expect(result).toEqual(labelEuMock);

      expect(cityRepositoryMock.getByIndex).toHaveBeenCalledTimes(0);

      expect(countryRepositoryMock.getByIndex).toHaveBeenCalledTimes(1);
      expect(countryRepositoryMock.getByIndex).toHaveBeenCalledWith(
        'cog',
        foreignCog,
      );
    });
  });

  describe('injectLabelsForCogs()', () => {
    const mockCogs = ['1', '2', '3'];

    beforeEach(() => {
      service['getLabelFromCog'] = jest.fn();
    });

    it('should transform all cogs to labels', () => {
      // Given
      service['getLabelFromCog'] = jest
        .fn()
        .mockReturnValueOnce('a')
        .mockReturnValueOnce('b')
        .mockReturnValueOnce('c');

      // When
      const results = service.injectLabelsForCogs(mockCogs);

      // Then
      expect(results).toEqual(['a', 'b', 'c']);
    });

    it('should fail to transform cogs into labels', () => {
      // Given
      const errorMock = new Error('Unknown Error');

      // When
      service['getLabelFromCog'] = jest.fn().mockImplementationOnce(() => {
        throw errorMock;
      });

      // Then
      expect(() => service.injectLabelsForCogs(mockCogs)).toThrow(errorMock);
    });
  });

  describe('getCountryCogFromIso()', () => {
    it('should query for the country cog with the provided iso in the "iso" index', () => {
      // Given
      const iso = 'FR';
      const cog = '99135';
      isoCogCountryRepositoryMock.getByIndex.mockReturnValueOnce({ cog });

      // When
      service.getCountryCogFromIso(iso);

      // Then
      expect(
        isoCogCountryRepositoryMock.getByIndex,
      ).toHaveBeenCalledExactlyOnceWith('iso', iso);
    });

    it('should return the country cog from the iso', () => {
      // Given
      const iso = 'FR';
      const cog = '99135';
      isoCogCountryRepositoryMock.getByIndex.mockReturnValueOnce({ cog });

      // When
      const result = service.getCountryCogFromIso(iso);

      // Then
      expect(result).toEqual(cog);
    });

    it('should return null if the iso is not found', () => {
      // Given
      const iso = 'FR';
      isoCogCountryRepositoryMock.getByIndex.mockReturnValueOnce(null);

      // When
      const result = service.getCountryCogFromIso(iso);

      // Then
      expect(result).toEqual(undefined);
    });
  });
});
