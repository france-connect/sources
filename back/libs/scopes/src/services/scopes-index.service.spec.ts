import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { Providers } from '../enum';
import {
  IClaimIndex,
  IProviderMappings,
  IRichClaim,
  IScopeIndex,
} from '../interfaces';
import { CONFIG_NAME } from '../tokens';
import { ScopesIndexService } from './scopes-index.service';

describe('ScopesIndexService', () => {
  let service: ScopesIndexService;

  const loggerMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
  };

  const mappingMock: IProviderMappings[] = [
    {
      provider: {
        key: Providers.CNAM,
        label: 'Data Provider 1 Mock Label',
      },
      claims: {
        wizzClaim: 'wizzClaim',
      },
      labels: {
        wizzClaim: 'Label for wizzClaim',
      },
      scopes: {
        wizzScope: ['wizzClaim'],
      },
    },

    {
      provider: {
        key: Providers.PE,
        label: 'Data Provider 2 Mock Label',
      },
      claims: {
        fooClaim: 'fooClaim',
        barClaim: 'barClaim',
        fizzClaim: 'fizzClaim',
        buzzClaim: 'buzzClaim',
      },
      labels: {
        fooClaim: 'Label for fooClaim',
        barClaim: 'Label for barClaim',
        fizzClaim: 'Label for fizzClaim',
        buzzClaim: 'Label for buzzClaim',
      },
      scopes: {
        fooScope: ['fooClaim', 'barClaim'],
        fizzcope: ['fizzClaim', 'buzzClaim', 'barClaim'],
      },
    },
  ];

  const configMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScopesIndexService,
        ConfigService,
        LoggerService,
        {
          provide: CONFIG_NAME,
          useValue: configMock,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<ScopesIndexService>(ScopesIndexService);

    configMock.get.mockReturnValue({ mapping: mappingMock });
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('onModuleInit', () => {
    const prepareClaimIndexMockReturnedMock = {};
    const prepareScopeIndexMockReturnedMock = {};

    beforeEach(() => {
      service['prepareClaimIndex'] = jest
        .fn()
        .mockReturnValue(prepareClaimIndexMockReturnedMock);
      service['prepareScopeIndex'] = jest
        .fn()
        .mockReturnValue(prepareScopeIndexMockReturnedMock);
    });

    it('should call prepareClaimIndex', () => {
      // When
      service.onModuleInit();
      // Then
      expect(service['prepareClaimIndex']).toHaveBeenCalledTimes(1);
      expect(service['prepareClaimIndex']).toHaveBeenCalledWith(mappingMock);
    });

    it('should affect result from prepareClaimIndex to claimIndex private property', () => {
      // When
      service.onModuleInit();
      // Then
      expect(service['claimIndex']).toBe(prepareClaimIndexMockReturnedMock);
    });

    it('should call prepareScopeIndex', () => {
      // When
      service.onModuleInit();
      // Then
      expect(service['prepareScopeIndex']).toHaveBeenCalledTimes(1);
      expect(service['prepareScopeIndex']).toHaveBeenCalledWith(mappingMock);
    });

    it('should affect result from prepareScopeIndex to claimIndex private property', () => {
      // When
      service.onModuleInit();
      // Then
      expect(service['scopeIndex']).toBe(prepareScopeIndexMockReturnedMock);
    });
  });

  describe('get claims', () => {
    it('should return claimIndex property', () => {
      // Given
      service['claimIndex'] = {} as IClaimIndex;
      // When
      const result = service.claims;
      // Then
      expect(result).toBe(service['claimIndex']);
    });
  });

  describe('get scopes', () => {
    it('should return claimIndex property', () => {
      // Given
      service['scopeIndex'] = {} as IScopeIndex;
      // When
      const result = service.scopes;
      // Then
      expect(result).toBe(service['scopeIndex']);
    });
  });

  describe('getRichClaimsForDataProvider', () => {
    it('should return claims for one to one scopes', () => {
      // Given
      const expected: { [key: string]: IRichClaim } = {
        wizzClaim: {
          identifier: 'wizzClaim',
          label: 'Label for wizzClaim',
          provider: {
            key: 'CNAM',
            label: 'Data Provider 1 Mock Label',
          },
        },
      };
      // When
      const result = service['getRichClaimsForDataProvider'](mappingMock[0]);

      // Then
      expect(result).toEqual(expected);
    });

    it('should return unique claims for manual scopes', () => {
      // When
      const result = service['getRichClaimsForDataProvider'](mappingMock[1]);

      // Then
      expect(result).toEqual({
        fooClaim: {
          identifier: 'fooClaim',
          label: 'Label for fooClaim',
          provider: {
            key: 'PE',
            label: 'Data Provider 2 Mock Label',
          },
        },
        barClaim: {
          identifier: 'barClaim',
          label: 'Label for barClaim',
          provider: {
            key: 'PE',
            label: 'Data Provider 2 Mock Label',
          },
        },
        fizzClaim: {
          identifier: 'fizzClaim',
          label: 'Label for fizzClaim',
          provider: {
            key: 'PE',
            label: 'Data Provider 2 Mock Label',
          },
        },
        buzzClaim: {
          identifier: 'buzzClaim',
          label: 'Label for buzzClaim',
          provider: {
            key: 'PE',
            label: 'Data Provider 2 Mock Label',
          },
        },
      });
    });
  });

  describe('prepareClaimIndex', () => {
    it('should return spread `getRichClaimsForDataProvider()` results)', () => {
      // Given
      service['getRichClaimsForDataProvider'] = jest
        .fn()
        .mockReturnValueOnce({
          fizz: 'fizzValue',
        })
        .mockReturnValueOnce({
          buzz: 'buzzValue',
        });

      // When
      const result = service['prepareClaimIndex'](mappingMock);
      // Then
      expect(result instanceof Map).toBeTruthy();
      expect(result.size).toBe(2);

      expect(result.get('fizz')).toBe('fizzValue');
      expect(result.get('buzz')).toBe('buzzValue');
    });
  });

  describe('prepareScopeIndex', () => {
    it('should return a flatten map of scopes', () => {
      // When
      const result = service['prepareScopeIndex'](mappingMock);
      // Then
      expect(result instanceof Map).toBeTruthy();
      expect(result.size).toBe(3);

      expect(result.get('wizzScope')).toStrictEqual(['wizzClaim']);
      expect(result.get('fooScope')).toStrictEqual(['fooClaim', 'barClaim']);
      expect(result.get('fizzcope')).toStrictEqual([
        'fizzClaim',
        'buzzClaim',
        'barClaim',
      ]);
    });
  });
});
