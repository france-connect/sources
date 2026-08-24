import { Test, TestingModule } from '@nestjs/testing';

import { InseeResolver } from '../resolvers';
import { EudiCogService } from './eudi-cog.service';

describe('EudiCogService', () => {
  let service: EudiCogService;

  const inseeResolverMock = {
    foreignCountry: jest.fn(),
    getResolver: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [InseeResolver, EudiCogService],
    })
      .overrideProvider(InseeResolver)
      .useValue(inseeResolverMock)
      .compile();

    service = module.get<EudiCogService>(EudiCogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call the getResolver method of resolvers', () => {
      // When
      service.onModuleInit();

      // Then
      expect(inseeResolverMock.getResolver).toHaveBeenCalledExactlyOnceWith(
        'foreignCountry',
      );
    });

    it('should set the resolvers to the service', () => {
      // Given
      const resolver = Symbol('resolver');
      inseeResolverMock.getResolver.mockReturnValue(resolver);

      // When
      service.onModuleInit();

      // Then
      expect(service['resolvers']).toEqual([resolver]);
    });
  });

  describe('resolveCog', () => {
    // Given
    const birthPlace = {
      country: 'FR',
      birthplace: 'Paris VII',
    };

    const resolver1 = jest.fn();
    const resolver2 = jest.fn();
    const resolver3 = jest.fn();

    beforeEach(() => {
      service['resolvers'] = [resolver1, resolver2, resolver3];
      service['isResolved'] = jest.fn().mockReturnValue(false);
    });

    it('should call the resolvers with the birthplace and context object', () => {
      // When
      service.resolveCog(birthPlace);

      // Then
      expect(resolver1).toHaveBeenCalledWith(birthPlace, expect.any(Object));
      expect(resolver2).toHaveBeenCalledWith(birthPlace, expect.any(Object));
      expect(resolver3).toHaveBeenCalledWith(birthPlace, expect.any(Object));
    });

    it('should pass the context object from resolver to the next resolver', () => {
      // When
      service.resolveCog(birthPlace);

      // Given
      const context = resolver1.mock.calls[0][1];

      // Then
      expect(resolver2).toHaveBeenCalledWith(birthPlace, context);
      expect(resolver3).toHaveBeenCalledWith(birthPlace, context);
    });

    it('should stop calling the resolvers if the context is resolved', () => {
      // Given
      service['isResolved'] = jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      // When
      service.resolveCog(birthPlace);

      // Then
      expect(resolver1).toHaveBeenCalledOnce();
      expect(resolver2).not.toHaveBeenCalled();
      expect(resolver3).not.toHaveBeenCalled();
    });

    it('should return the result part of the context object if the context is resolved', () => {
      // Given
      service['isResolved'] = jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      resolver1.mockImplementationOnce((_birthPlace, context) => {
        context.result = {
          birthcountry: '99100',
          birthplace: '750007',
        };
      });

      // When
      const result = service.resolveCog(birthPlace);

      // Then
      expect(result).toEqual({
        birthcountry: '99100',
        birthplace: '750007',
      });
    });
  });

  describe('isResolved', () => {
    it('should return false if the birthcountry is not set', () => {
      // Given
      const context = {
        result: {
          birthcountry: undefined,
          birthplace: undefined,
        },
      };

      // When
      const result = service['isResolved'](context);

      // Then
      expect(result).toBe(false);
    });

    it('should return true if the birthcountry is set and the country is not France', () => {
      // Given
      const context = {
        result: {
          birthcountry: '99223',
          birthplace: undefined,
        },
      };

      // When
      const result = service['isResolved'](context);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if the birthcountry is set and the country is France but the birthplace is not set', () => {
      // Given
      const context = {
        result: {
          birthcountry: '99100',
          birthplace: undefined,
        },
      };

      // When
      const result = service['isResolved'](context);

      // Then
      expect(result).toBe(false);
    });

    it('should return true if the birthcountry is set and the country is France and the birthplace is set', () => {
      // Given
      const context = {
        result: {
          birthcountry: '99100',
          birthplace: '750007',
        },
      };

      // When
      const result = service['isResolved'](context);

      // Then
      expect(result).toBe(true);
    });
  });

  describe('isFrench', () => {
    it('should return true if the COG is France', () => {
      // Given
      const frenchCog = '99100';

      // When
      const result = service['isFrench'](frenchCog);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if the COG is not France', () => {
      // Given
      const polishCog = '99223';
      // When
      const result = service['isFrench'](polishCog);

      // Then
      expect(result).toBe(false);
    });
  });
});
