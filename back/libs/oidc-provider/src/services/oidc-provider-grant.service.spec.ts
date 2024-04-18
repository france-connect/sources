import { Test, TestingModule } from '@nestjs/testing';

import { safelyParseJson } from '@fc/common';
import { stringToArray } from '@fc/oidc';

import {
  OidcProviderGrantSaveException,
  OidcProviderParseJsonClaimsException,
} from '../exceptions';
import { OidcProviderGrantService } from './oidc-provider-grant.service';

jest.mock('@fc/common');
jest.mock('@fc/oidc');

describe('OidcProviderGrantService', () => {
  let service: OidcProviderGrantService;

  const interactionIdMock = 'interactionIdMockValue';
  const clientIdMock = 'clientIdMockValue';

  const reqMock = Symbol('req');
  const resMock = Symbol('res');

  let grantMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [OidcProviderGrantService],
    }).compile();

    service = module.get<OidcProviderGrantService>(OidcProviderGrantService);
  });

  describe('generateGrant', () => {
    let providerMock;
    let stringToArrayMock;

    const interactionDetailsMock = {
      params: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: clientIdMock,
        scope: 'nautilus u571',
        claims:
          '{"id_token":{"rep_scope":{"essential":true,"values":"["foo","bar"]"}}}',
      },
    };

    beforeEach(() => {
      grantMock = {
        accountId: '',
        clientId: '',
        addOIDCScope: jest.fn(),
        addOIDCClaims: jest.fn(),
      };

      providerMock = {
        // We need to use a function because we want to test the constructor
        Grant: jest.fn().mockImplementation(() => {
          return grantMock;
        }),
        interactionDetails: jest
          .fn()
          .mockReturnValueOnce(interactionDetailsMock),
      };

      service['isRepScopeRequested'] = jest.fn();
      stringToArrayMock = jest.mocked(stringToArray);
      stringToArrayMock.mockReturnValue([]);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should call interactionDetail once with req and res', async () => {
      // Given

      // When
      await service.generateGrant(
        providerMock,
        reqMock,
        resMock,
        interactionIdMock,
      );
      // Then
      expect(providerMock.interactionDetails).toHaveBeenCalledTimes(1);
      expect(providerMock.interactionDetails).toHaveBeenCalledWith(
        reqMock,
        resMock,
      );
    });

    it('should call Grant constructor once and set interactionId and clientId', async () => {
      // Given

      // When
      await service.generateGrant(
        providerMock,
        reqMock,
        resMock,
        interactionIdMock,
      );

      // Then
      expect(providerMock.Grant).toHaveBeenCalledTimes(1);
      expect(providerMock.Grant).toHaveBeenCalledTimes(1);
      expect(providerMock.Grant).toHaveBeenCalledWith();
      expect(grantMock.accountId).toEqual(interactionIdMock);
      expect(grantMock.clientId).toEqual(clientIdMock);
    });

    it('should call isRepScopeRequested', async () => {
      // Given

      // When
      await service.generateGrant(
        providerMock,
        reqMock,
        resMock,
        interactionIdMock,
      );

      // Then
      expect(service['isRepScopeRequested']).toHaveBeenCalledTimes(1);
      expect(service['isRepScopeRequested']).toHaveBeenCalledWith(
        interactionDetailsMock.params.claims,
      );
    });

    it('should call grant.addOidcScope for each scope', async () => {
      // Given
      const scopesMock = ['nautilus', 'u571'];
      stringToArrayMock.mockReturnValue(scopesMock);
      // When
      await service.generateGrant(
        providerMock,
        reqMock,
        resMock,
        interactionIdMock,
      );
      // Then
      expect(grantMock.addOIDCScope).toHaveBeenNthCalledWith(1, scopesMock[0]);
      expect(grantMock.addOIDCScope).toHaveBeenNthCalledWith(2, scopesMock[1]);
    });

    it("should don't call grant.addOIDCClaims if isRepScopeRequested return false", async () => {
      // Given
      service['isRepScopeRequested'] = jest.fn().mockReturnValue(false);

      // When
      await service.generateGrant(
        providerMock,
        reqMock,
        resMock,
        interactionIdMock,
      );
      // Then
      expect(grantMock.addOIDCClaims).toHaveBeenCalledTimes(0);
    });

    it('should call grant.addOIDCClaims if isRepScopeRequested return true', async () => {
      // Given
      service['isRepScopeRequested'] = jest.fn().mockReturnValue(true);

      // When
      await service.generateGrant(
        providerMock,
        reqMock,
        resMock,
        interactionIdMock,
      );
      // Then
      expect(grantMock.addOIDCClaims).toHaveBeenCalledTimes(1);
      expect(grantMock.addOIDCClaims).toHaveBeenCalledWith(['rep_scope']);
    });
  });

  describe('saveGrant', () => {
    beforeEach(() => {
      grantMock = {
        save: jest.fn(),
      };
    });
    it('should save grant', async () => {
      // Given
      const grantSaveMock = 'grantSaveMockValue';
      grantMock.save.mockResolvedValueOnce(grantSaveMock);
      // When
      const result = await service.saveGrant(grantMock);

      expect(result).toEqual(grantSaveMock);
      expect(grantMock.save).toHaveBeenCalledTimes(1);
      expect(grantMock.save).toHaveBeenCalledWith();
    });

    it('should throw an error if grant failed to save', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      grantMock.save.mockRejectedValueOnce(errorMock);
      // When
      await expect(service.saveGrant(grantMock)).rejects.toThrow(
        OidcProviderGrantSaveException,
      );
    });
  });

  describe('isRepScopeRequested()', () => {
    it('should returns false when claims are empty', () => {
      // When
      const result = service['isRepScopeRequested']('');

      // Then
      expect(result).toEqual(false);
    });

    it('should throws exception when claims are not JSON parsable', () => {
      // Given
      const invalidClaims = 'not a valid JSON string';

      const safelyParseJsonMock = jest.mocked(safelyParseJson);
      safelyParseJsonMock.mockImplementationOnce(() => {
        throw new Error();
      });

      // When / Then
      expect(() => {
        service['isRepScopeRequested'](invalidClaims);
      }).toThrow(OidcProviderParseJsonClaimsException);
    });

    it('should returns false when rep_scope is not essential', () => {
      // Given
      const claimsMock = '{"id_token":{"rep_scope":{"essential":false}}}';
      const claimsMockParsed = {
        // oidc naming convention
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id_token: { rep_scope: { essential: false } },
      };

      const safelyParseJsonMock = jest.mocked(safelyParseJson);
      safelyParseJsonMock.mockReturnValue(claimsMockParsed);

      // When
      const result = service['isRepScopeRequested'](claimsMock);

      // Then
      expect(result).toEqual(false);
    });
  });
});
