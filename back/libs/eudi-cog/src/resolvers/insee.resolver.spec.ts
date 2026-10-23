import { Test, TestingModule } from '@nestjs/testing';

import { CogService } from '@fc/cog';

import { ResolutionContextInterface } from '../interfaces';
import { InseeResolver } from './insee.resolver';

describe('InseeResolver', () => {
  let resolver: InseeResolver;

  const ISO_COUNTRY_FRANCE = 'FR';
  const COG_COUNTRY_FRANCE = '99100';

  const cogServiceMock = {
    getCountryCogFromIso: jest.fn(),
    getCitiesByNcc: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [InseeResolver, CogService],
    })
      .overrideProvider(CogService)
      .useValue(cogServiceMock)
      .compile();

    resolver = module.get<InseeResolver>(InseeResolver);

    cogServiceMock.getCountryCogFromIso.mockReturnValue(COG_COUNTRY_FRANCE);
  });

  it('should be defined', () => {
    // Then
    expect(resolver).toBeDefined();
  });

  describe('foreignCountry()', () => {
    let context: ResolutionContextInterface;

    beforeEach(() => {
      context = {
        result: {
          birthplace: '',
          birthcountry: undefined,
        },
      };
    });

    it('should not alter context if the country is not provided', () => {
      // Given
      const birthPlace = {
        country: undefined,
      };

      // When
      resolver.foreignCountry(birthPlace, context);

      // Then
      expect(context.result).toEqual({
        birthplace: '',
        birthcountry: undefined,
      });
    });

    it('should not try to resolve the COG if the country is not provided', () => {
      // Given
      const birthPlace = {
        country: undefined,
      };

      // When
      resolver.foreignCountry(birthPlace, context);

      // Then
      expect(cogServiceMock.getCountryCogFromIso).not.toHaveBeenCalled();
    });

    it('should search the COG for the country ISO when provided', () => {
      // Given
      const birthPlace = {
        country: ISO_COUNTRY_FRANCE,
      };

      // When
      resolver.foreignCountry(birthPlace, context);

      // Then
      expect(
        cogServiceMock.getCountryCogFromIso,
      ).toHaveBeenCalledExactlyOnceWith(ISO_COUNTRY_FRANCE);
    });

    it('should set the birthcountry in the context if the COG is found', () => {
      // Given
      const birthPlace = {
        country: ISO_COUNTRY_FRANCE,
      };

      // When
      resolver.foreignCountry(birthPlace, context);

      // Then
      expect(context.result).toEqual({
        birthplace: '',
        birthcountry: COG_COUNTRY_FRANCE,
      });
    });

    it('should return undefined if the COG is not found', () => {
      // Given
      const birthPlace = {
        country: ISO_COUNTRY_FRANCE,
      };
      cogServiceMock.getCountryCogFromIso.mockReturnValue(undefined);

      // When
      resolver.foreignCountry(birthPlace, context);

      // Then
      expect(context.result).toEqual({
        birthplace: '',
        birthcountry: undefined,
      });
    });
  });

  describe('frenchCity()', () => {
    const NCC_NANCY = 'NANCY';
    const COG_NANCY = '54395';

    let context: ResolutionContextInterface;

    beforeEach(() => {
      context = {
        result: {
          birthplace: '',
          birthcountry: COG_COUNTRY_FRANCE,
        },
      };

      cogServiceMock.getCitiesByNcc.mockReturnValue([
        {
          com: COG_NANCY,
          lastComparent: COG_NANCY,
          libelle: 'Nancy',
          ncc: NCC_NANCY,
        },
      ]);
    });

    it('should set the city COG in the context when a single city matches', () => {
      // Given
      const birthPlace = { country: ISO_COUNTRY_FRANCE, locality: 'Nancy' };

      // When
      resolver.frenchCity(birthPlace, context);

      // Then
      expect(cogServiceMock.getCitiesByNcc).toHaveBeenCalledExactlyOnceWith(
        NCC_NANCY,
      );
      expect(context.result.birthplace).toBe(COG_NANCY);
    });

    it('should normalize the locality before searching', () => {
      // Given
      const birthPlace = {
        country: ISO_COUNTRY_FRANCE,
        locality: 'Saint-Clément-de-Valorgue',
      };

      // When
      resolver.frenchCity(birthPlace, context);

      // Then
      expect(cogServiceMock.getCitiesByNcc).toHaveBeenCalledExactlyOnceWith(
        'SAINT CLEMENT DE VALORGUE',
      );
    });

    it('should match an overseas name whose article is part of NCC', () => {
      // Given
      cogServiceMock.getCitiesByNcc.mockImplementation((name) =>
        name === 'LA FOA'
          ? [{ com: '98813', lastComparent: '98813', ncc: name }]
          : [],
      );
      // When
      resolver.frenchCity({ country: 'FR', locality: 'La Foa' }, context);
      // Then
      expect(cogServiceMock.getCitiesByNcc).toHaveBeenCalledTimes(2);
      expect(cogServiceMock.getCitiesByNcc).toHaveBeenCalledWith('FOA');
      expect(cogServiceMock.getCitiesByNcc).toHaveBeenCalledWith('LA FOA');
      expect(context.result.birthplace).toBe('98813');
    });

    it('should deduplicate the same COG found with and without an article', () => {
      // Given
      cogServiceMock.getCitiesByNcc.mockReturnValue([
        { com: '98813', lastComparent: '98813' },
      ]);
      // When
      resolver.frenchCity({ country: 'FR', locality: 'La Foa' }, context);
      // Then
      expect(context.result.birthplace).toBe('98813');
    });

    it('should not choose between distinct COGs found with and without an article', () => {
      // Given
      cogServiceMock.getCitiesByNcc
        .mockReturnValueOnce([{ com: '01001', lastComparent: '01001' }])
        .mockReturnValueOnce([{ com: '02001', lastComparent: '02001' }]);
      // When
      resolver.frenchCity({ country: 'FR', locality: 'La Commune' }, context);
      // Then
      expect(context.result.birthplace).toBe('');
    });

    it('should resolve historical and current COGs sharing a final parent', () => {
      // Given
      cogServiceMock.getCitiesByNcc.mockReturnValue([
        { com: '75032', lastComparent: '92032' },
        { com: '92032', lastComparent: '92032' },
      ]);
      // When
      resolver.frenchCity(
        { country: 'FR', locality: 'Fontenay-aux-Roses' },
        context,
      );
      // Then
      expect(context.result.birthplace).toBe('92032');
    });

    it('should return the final parent even for a single historical match', () => {
      // Given
      cogServiceMock.getCitiesByNcc.mockReturnValue([
        { com: '85052', lastComparent: '85152' },
      ]);
      // When
      resolver.frenchCity(
        { country: 'FR', locality: 'La Chapelle-Achard' },
        context,
      );
      // Then
      expect(context.result.birthplace).toBe('85152');
    });

    it('should merge distinct COGs found with and without an article when their final parent matches', () => {
      // Given
      cogServiceMock.getCitiesByNcc
        .mockReturnValueOnce([{ com: '01001', lastComparent: '01003' }])
        .mockReturnValueOnce([{ com: '01002', lastComparent: '01003' }]);
      // When
      resolver.frenchCity({ country: 'FR', locality: 'La Commune' }, context);
      // Then
      expect(context.result.birthplace).toBe('01003');
    });

    it('should keep multiple final parents ambiguous even when some candidates converge', () => {
      // Given
      cogServiceMock.getCitiesByNcc.mockReturnValue([
        { com: '01001', lastComparent: '01003' },
        { com: '01002', lastComparent: '01003' },
        { com: '02001', lastComparent: '02001' },
      ]);
      // When
      resolver.frenchCity({ country: 'FR', locality: 'Commune' }, context);
      // Then
      expect(context.result.birthplace).toBe('');
    });

    it('should leave the birthplace empty when the birthcountry is missing', () => {
      // Given
      const birthPlace = { country: undefined, locality: 'Nancy' };
      context.result.birthcountry = undefined;

      // When
      resolver.frenchCity(birthPlace, context);

      // Then
      expect(cogServiceMock.getCitiesByNcc).not.toHaveBeenCalled();
      expect(context.result.birthplace).toBe('');
    });

    it('should leave the birthplace empty when the birth is not in France', () => {
      // Given
      const birthPlace = { country: 'BE', locality: 'Bruxelles' };
      context.result.birthcountry = '99131';

      // When
      resolver.frenchCity(birthPlace, context);

      // Then
      expect(cogServiceMock.getCitiesByNcc).not.toHaveBeenCalled();
      expect(context.result.birthplace).toBe('');
    });

    it('should leave the birthplace empty when the locality is missing', () => {
      // Given
      const birthPlace = { country: ISO_COUNTRY_FRANCE, locality: undefined };

      // When
      resolver.frenchCity(birthPlace, context);

      // Then
      expect(cogServiceMock.getCitiesByNcc).not.toHaveBeenCalled();
      expect(context.result.birthplace).toBe('');
    });

    it('should leave the birthplace empty when no city matches', () => {
      // Given
      const birthPlace = {
        country: ISO_COUNTRY_FRANCE,
        locality: 'Saint Poule les Coqs',
      };
      cogServiceMock.getCitiesByNcc.mockReturnValue([]);

      // When
      resolver.frenchCity(birthPlace, context);

      // Then
      expect(context.result.birthplace).toBe('');
    });

    it('should leave the birthplace empty when several cities share the name', () => {
      // Given
      const birthPlace = {
        country: ISO_COUNTRY_FRANCE,
        locality: 'Saint-Denis',
      };
      cogServiceMock.getCitiesByNcc.mockReturnValue([
        {
          com: '11339',
          lastComparent: '11339',
          libelle: 'Saint-Denis',
          ncc: 'SAINT DENIS',
        },
        {
          com: '93066',
          lastComparent: '93066',
          libelle: 'Saint-Denis',
          ncc: 'SAINT DENIS',
        },
      ]);

      // When
      resolver.frenchCity(birthPlace, context);

      // Then
      expect(context.result.birthplace).toBe('');
    });
  });
});
