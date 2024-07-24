import { Test, TestingModule } from '@nestjs/testing';

import { unique } from '@fc/common';

import * as PROVIDERS from '../data';
import { ScopesService } from './scopes.service';
import { ScopesIndexService } from './scopes-index.service';

jest.mock('@fc/common');
jest.mock('../data', () => ({
  foo: {
    provider: {
      slug: 'IDENTIFIER_MOCK',
    },
    scopes: {
      foo: Symbol('foo'),
      bar: Symbol('bar'),
    },
  },
}));

describe('ScopesService', () => {
  let service: ScopesService;
  const uniqueMock = jest.mocked(unique);

  const IdentifierMock = 'IDENTIFIER_MOCK';
  const StaticProvidersMocked = jest.mocked(PROVIDERS);

  const scopesIndexServiceMock = {
    getClaim: jest.fn(),
    getScope: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ScopesIndexService, ScopesService],
    })
      .overrideProvider(ScopesIndexService)
      .useValue(scopesIndexServiceMock)
      .compile();

    service = module.get<ScopesService>(ScopesService);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getRawClaimsFromScopes', () => {
    const mockedReduceReturnValue = [];
    const uniqueMockReturnValue = [];
    const scopesMock = ['foo', 'bar'];
    uniqueMockReturnValue.sort = jest.fn();

    it('should call reduce() on input scope array', () => {
      // Given
      scopesMock.reduce = jest.fn().mockReturnValue(mockedReduceReturnValue);
      // When
      service.getRawClaimsFromScopes(scopesMock);
      // Then
      expect(scopesMock.reduce).toHaveBeenCalledTimes(1);
    });

    it('should call unique() with result from reduce', () => {
      // Given
      const scopesMock = ['foo', 'bar'];
      scopesMock.reduce = jest.fn().mockReturnValue(mockedReduceReturnValue);
      // When
      service.getRawClaimsFromScopes(scopesMock);
      // Then
      expect(uniqueMock).toHaveBeenCalledTimes(1);
      expect(uniqueMock).toHaveBeenCalledWith(mockedReduceReturnValue);
    });

    it('should return mapped claims for scope', () => {
      // Given
      const scopesMock = ['openid', 'phone'];
      scopesIndexServiceMock.getScope
        .mockReturnValueOnce('sub')
        .mockReturnValueOnce('phone_number');
      uniqueMock.mockImplementationOnce((input) => input);
      // When
      const result = service.getRawClaimsFromScopes(scopesMock);
      // Then
      expect(result).toEqual(['sub', 'phone_number']);
    });

    it('should ignore entry if key is not in map', () => {
      // Given
      const scopesMock = ['openid', 'phone', 'foo'];
      scopesIndexServiceMock.getScope
        .mockReturnValueOnce('sub')
        .mockReturnValueOnce('phone_number')
        .mockReturnValueOnce(undefined);
      uniqueMock.mockImplementationOnce((input) => input);
      // When
      const result = service.getRawClaimsFromScopes(scopesMock);
      // Then
      expect(result).toEqual(['sub', 'phone_number']);
    });
  });

  describe('getRichClaimsFromClaims', () => {
    it('should return claims mapped to claims objects stored claimIndex', () => {
      // Given
      const richClaimsMock = {
        fooClaim1: Symbol('fooClaim1'),
        fooClaim2: Symbol('fooClaim2'),
        barClaim1: Symbol('barClaim1'),
      };

      const claimsMock = ['fooClaim1', 'fooClaim2', 'barClaim1'];

      scopesIndexServiceMock.getClaim
        .mockReturnValueOnce(richClaimsMock.fooClaim1)
        .mockReturnValueOnce(richClaimsMock.fooClaim2)
        .mockReturnValueOnce(richClaimsMock.barClaim1);

      // When
      const result = service.getRichClaimsFromClaims(claimsMock);
      // Then
      expect(result).toStrictEqual([
        richClaimsMock.fooClaim1,
        richClaimsMock.fooClaim2,
        richClaimsMock.barClaim1,
      ]);
    });
  });

  describe('getRichClaimsFromScopes', () => {
    const scopesMock = ['foo', 'bar'];
    const getRawClaimsFromScopesMockReturnValue = [
      'fooClaim1',
      'fooClaim2',
      'barClaim1',
    ];

    const getRichClaimsFromClaimsMockReturnValue = {};

    beforeEach(() => {
      service.getRawClaimsFromScopes = jest
        .fn()
        .mockReturnValue(getRawClaimsFromScopesMockReturnValue);
      service.getRichClaimsFromClaims = jest
        .fn()
        .mockReturnValue(getRichClaimsFromClaimsMockReturnValue);
    });

    it('should call getRawClaimsFromScopes', () => {
      // When
      service.getRichClaimsFromScopes(scopesMock);
      // Then
      expect(service.getRawClaimsFromScopes).toHaveBeenCalledTimes(1);
      expect(service.getRawClaimsFromScopes).toHaveBeenCalledWith(scopesMock);
    });

    it('should call getRichClaimsFromClaims', () => {
      // When
      service.getRichClaimsFromScopes(scopesMock);
      // Then
      expect(service.getRichClaimsFromClaims).toHaveBeenCalledTimes(1);
      expect(service.getRichClaimsFromClaims).toHaveBeenCalledWith(
        getRawClaimsFromScopesMockReturnValue,
      );
    });

    it('should return the result of call to getRichClaimsFromClaims', () => {
      // When
      const result = service.getRichClaimsFromScopes(scopesMock);
      // Then
      expect(result).toBe(getRichClaimsFromClaimsMockReturnValue);
    });
  });

  describe('getScopesByProviderSlug', () => {
    it('should return the scopes of the provider', () => {
      // When
      const result = service.getScopesByProviderSlug(IdentifierMock);
      // Then
      expect(result).toEqual(Object.keys(StaticProvidersMocked['foo'].scopes));
    });
  });
});
