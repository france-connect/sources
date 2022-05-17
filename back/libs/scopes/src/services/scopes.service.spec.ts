import { mocked } from 'jest-mock';

import { Test, TestingModule } from '@nestjs/testing';

import { unique } from '@fc/common';

import { ScopesService } from './scopes.service';
import { ScopesIndexService } from './scopes-index.service';

jest.mock('@fc/common');

describe('ScopesService', () => {
  let service: ScopesService;
  const uniqueMock = mocked(unique);

  const scopesIndexServiceMock = {
    claims: new Map(
      Object.entries({
        sub: {
          label: 'openId',
          dataProvider: {
            name: 'MY_DATA_PROVIDER',
          },
        },
      }),
    ),
    scopes: new Map(
      Object.entries({
        openid: ['sub'],
        phone: ['phone_number'],
        foo: ['foo'],
      }),
    ),
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

    beforeEach(() => {
      service['scopeIndex'] = {
        openid: ['sub'],
        phone: ['phone_number'],
        foo: ['foo'],
      };
    });

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
      uniqueMock.mockImplementationOnce((input) => input);
      // When
      const result = service.getRawClaimsFromScopes(scopesMock);
      // Then
      expect(result).toEqual(['sub', 'phone_number']);
    });

    it('should return given input if key is not in map', () => {
      // Given
      const scopesMock = ['openid', 'phone', 'foo'];
      uniqueMock.mockImplementationOnce((input) => input);
      // When
      const result = service.getRawClaimsFromScopes(scopesMock);
      // Then
      expect(result).toEqual(['sub', 'phone_number', 'foo']);
    });
  });

  describe('getRichClaimsFromScopes', () => {
    const scopesMock = ['foo', 'bar'];
    const getRawClaimsFromScopesMockReturnValue = [
      'fooClaim1',
      'fooClaim2',
      'barClaim1',
    ];

    beforeEach(() => {
      service.getRawClaimsFromScopes = jest
        .fn()
        .mockReturnValue(getRawClaimsFromScopesMockReturnValue);
    });

    it('should call getRawClaimsFromScopes', () => {
      // Given

      // When
      service.getRichClaimsFromScopes(scopesMock);
      // Then
      expect(service.getRawClaimsFromScopes).toHaveBeenCalledTimes(1);
      expect(service.getRawClaimsFromScopes).toHaveBeenCalledWith(scopesMock);
    });

    it('should return claims resolved from scopes, mapped to claims objects stored claimIndex', () => {
      // Given
      const claimsMock = {
        fooClaim1: Symbol('fooClaim1'),
        fooClaim2: Symbol('fooClaim2'),
        barClaim1: Symbol('barClaim1'),
      };
      const indexServiceClaimsGetterReturnValue = new Map(
        Object.entries(claimsMock),
      );
      // Mocking a getter is a bit trickier than a regular method...
      Object.defineProperty(service['index'], 'claims', {
        get: jest.fn().mockReturnValue(indexServiceClaimsGetterReturnValue),
      });

      // When
      const result = service.getRichClaimsFromScopes(scopesMock);
      // Then
      expect(result).toStrictEqual([
        claimsMock.fooClaim1,
        claimsMock.fooClaim2,
        claimsMock.barClaim1,
      ]);
    });
  });
});
