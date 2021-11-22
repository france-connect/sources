import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { CogService } from './cog.service';
import { CityInterface, CountryInterface } from './interfaces';
import { COG_CITY, COG_COUNTRY } from './tokens';

describe('CogService', () => {
  let service: CogService;

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const cityRepositoryMock = {
    find: jest.fn(),
    parse: jest.fn(),
  };

  const countryRepositoryMock = {
    find: jest.fn(),
    parse: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CogService,
        LoggerService,
        ConfigService,
        {
          provide: COG_CITY,
          useValue: cityRepositoryMock,
        },
        {
          provide: COG_COUNTRY,
          useValue: countryRepositoryMock,
        },
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<CogService>(CogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('onModuleInit', () => {
    const configMock = {
      [COG_CITY]: 'cogCityValue',
      [COG_COUNTRY]: 'cogCountryValue',
    };

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce(configMock);
    });

    it('should retrieve the database source from the config', async () => {
      // action
      await service['onModuleInit']();

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('Cog');
    });

    it('should initialize the database with parsing file', async () => {
      // action
      await service['onModuleInit']();

      // expect
      expect(cityRepositoryMock.parse).toHaveBeenCalledTimes(1);
      expect(cityRepositoryMock.parse).toHaveBeenCalledWith(
        configMock[COG_CITY],
      );
      expect(countryRepositoryMock.parse).toHaveBeenCalledTimes(1);
      expect(countryRepositoryMock.parse).toHaveBeenCalledWith(
        configMock[COG_COUNTRY],
      );
    });

    it('should fail to init database if parsing failed', async () => {
      // setup
      const errorMock = new Error('Unknown Error');
      cityRepositoryMock.parse.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });

      // action
      await expect(
        service['onModuleInit'](),
        // expect
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
      cityRepositoryMock.find.mockResolvedValueOnce(cityMock);
      countryRepositoryMock.find.mockResolvedValueOnce(countryMock);
    });

    it('should transform French Cog to label with city', async () => {
      const result = await service.getLabelFromCog(franceCog);
      const filterSearch = { com: franceCog };
      expect(result).toEqual(labelFrMock);

      expect(cityRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(cityRepositoryMock.find).toHaveBeenCalledWith(filterSearch);

      expect(countryRepositoryMock.find).toHaveBeenCalledTimes(0);
    });
    it('should transform foreign cog to label with Country', async () => {
      const result = await service.getLabelFromCog(foreignCog);
      const filterSearch = { cog: foreignCog };
      expect(result).toEqual(labelEuMock);

      expect(cityRepositoryMock.find).toHaveBeenCalledTimes(0);

      expect(countryRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(countryRepositoryMock.find).toHaveBeenCalledWith(filterSearch);
    });

    it('should trace label based on cog', async () => {
      const trace = { isFrance: true, label: labelFrMock };
      await service.getLabelFromCog(franceCog);
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledWith(trace);
    });

    it('should fail if the City repository failed', async () => {
      const errorMock = new Error('Unknown Error');
      cityRepositoryMock.find.mockReset().mockRejectedValueOnce(errorMock);
      await expect(service.getLabelFromCog(franceCog)).rejects.toThrow(
        errorMock,
      );
      expect(cityRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(countryRepositoryMock.find).toHaveBeenCalledTimes(0);
    });

    it('should fail if the Country repository failed', async () => {
      const errorMock = new Error('Unknown Error');
      countryRepositoryMock.find.mockReset().mockRejectedValueOnce(errorMock);
      await expect(service.getLabelFromCog(foreignCog)).rejects.toThrow(
        errorMock,
      );
      expect(cityRepositoryMock.find).toHaveBeenCalledTimes(0);
      expect(countryRepositoryMock.find).toHaveBeenCalledTimes(1);
    });
  });
  describe('injectLabelsForCogs()', () => {
    let getLabelFromCogMock: jest.SpyInstance;
    const mockCogs = ['1', '2', '3'];

    beforeEach(() => {
      getLabelFromCogMock = jest.spyOn<CogService, any>(
        service,
        'getLabelFromCog',
      );
    });
    it('should transform all cogs to labels', async () => {
      getLabelFromCogMock
        .mockResolvedValueOnce('a')
        .mockResolvedValueOnce('b')
        .mockResolvedValueOnce('c');
      const results = await service.injectLabelsForCogs(mockCogs);
      expect(results).toEqual(['a', 'b', 'c']);
    });
    it('should fail to transform cogs into labels', async () => {
      const errorMock = new Error('Unknown Error');

      getLabelFromCogMock.mockReset().mockRejectedValueOnce(errorMock);
      await expect(service.injectLabelsForCogs(mockCogs)).rejects.toThrow(
        errorMock,
      );
    });
  });
});
