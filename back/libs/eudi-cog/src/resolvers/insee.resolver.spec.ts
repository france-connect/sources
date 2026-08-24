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
          birthplace: undefined,
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
        birthplace: undefined,
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
        birthplace: undefined,
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
        birthplace: undefined,
        birthcountry: undefined,
      });
    });
  });
});
