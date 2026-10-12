import { Test, TestingModule } from '@nestjs/testing';

import { DcqlService } from '@fc/dcql';
import { Openid4vpDeepLinkInterface } from '@fc/openid4vp/interfaces';

import { MockWalletInvalidRequestObjectPayloadException } from '../exceptions';
import { RequestObjectPayload, WalletIdentity } from '../interfaces';
import { PresentationService } from './presentation.service';
import { WalletDocumentService } from './wallet-document.service';

describe('PresentationService', () => {
  let service: PresentationService;

  const documentMock = {
    buildVpToken: jest.fn(),
  };
  const dcqlMock = {
    parse: jest.fn(),
    extractClaimNames: jest.fn(),
  };

  const dcqlRequest = {
    dcql_query: {
      credentials: [{ id: 'pid-fc', format: 'mso_mdoc' }],
    },
  } as unknown as RequestObjectPayload;

  const identity: WalletIdentity = {
    docType: 'eu.europa.ec.eudi.pid.1',
    attributes: { family_name: 'DUPONT', given_name: 'JEAN', extra: 'x' },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PresentationService, WalletDocumentService, DcqlService],
    })
      .overrideProvider(WalletDocumentService)
      .useValue(documentMock)
      .overrideProvider(DcqlService)
      .useValue(dcqlMock)
      .compile();

    service = module.get<PresentationService>(PresentationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractRequestedClaims', () => {
    beforeEach(() => {
      dcqlMock.parse.mockReturnValue({ credentials: [] });
      dcqlMock.extractClaimNames.mockReturnValue(['family_name']);
    });

    it('should extract DCQL claims from the request', () => {
      // When
      const result = service.extractRequestedClaims(dcqlRequest);

      // Then
      expect(dcqlMock.parse).toHaveBeenCalledExactlyOnceWith(
        dcqlRequest.dcql_query,
      );
      expect(result).toEqual(['family_name']);
    });

    it('should throw when dcql_query is missing', () => {
      // When / Then
      expect(() =>
        service.extractRequestedClaims({} as RequestObjectPayload),
      ).toThrow(MockWalletInvalidRequestObjectPayloadException);
    });
  });

  describe('selectClaims', () => {
    it('should keep only requested claims present in the identity', () => {
      // When
      const result = service.selectClaims(
        ['family_name', 'given_name', 'missing'],
        identity,
      );

      // Then
      expect(result).toEqual({ family_name: 'DUPONT', given_name: 'JEAN' });
    });

    it('should return an empty object when no claim is requested', () => {
      // When
      const result = service.selectClaims([], identity);

      // Then
      expect(result).toEqual({});
    });
  });

  describe('resolveState', () => {
    it('should prefer the request object state', () => {
      // When
      const result = service.resolveState(
        { state: 'request-state' } as RequestObjectPayload,
        { state: 'deep-link-state' } as Openid4vpDeepLinkInterface,
      );

      // Then
      expect(result).toBe('request-state');
    });

    it('should fall back to the deep link state', () => {
      // When
      const result = service.resolveState(
        {} as RequestObjectPayload,
        { state: 'deep-link-state' } as Openid4vpDeepLinkInterface,
      );

      // Then
      expect(result).toBe('deep-link-state');
    });

    it('should return undefined when neither source provides a state', () => {
      // When
      const result = service.resolveState(
        {} as RequestObjectPayload,
        {} as Openid4vpDeepLinkInterface,
      );

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('buildResponsePayload', () => {
    const dcqlPayload = {
      state: 'request-state',
      vp_token: { 'pid-fc': ['vp-token-mock'] },
    };

    beforeEach(() => {
      documentMock.buildVpToken.mockResolvedValue('vp-token-mock');
      service.extractRequestedClaims = jest
        .fn()
        .mockReturnValue(['family_name', 'given_name']);
      service.selectClaims = jest
        .fn()
        .mockReturnValue({ family_name: 'DUPONT', given_name: 'JEAN' });
      service['buildDcqlResponsePayload'] = jest
        .fn()
        .mockReturnValue(dcqlPayload);
    });

    it('should build the vp_token from the selected claims', async () => {
      // When
      await service.buildResponsePayload(
        dcqlRequest,
        {} as Openid4vpDeepLinkInterface,
        identity,
      );

      // Then
      expect(documentMock.buildVpToken).toHaveBeenCalledExactlyOnceWith(
        identity,
        { family_name: 'DUPONT', given_name: 'JEAN' },
        dcqlRequest,
      );
    });

    it('should assemble the DCQL wallet response payload', async () => {
      // When
      const result = await service.buildResponsePayload(
        dcqlRequest,
        {} as Openid4vpDeepLinkInterface,
        identity,
      );

      // Then
      expect(
        service['buildDcqlResponsePayload'],
      ).toHaveBeenCalledExactlyOnceWith(dcqlRequest, {}, 'vp-token-mock');
      expect(result).toBe(dcqlPayload);
    });
  });

  describe('buildDcqlResponsePayload', () => {
    beforeEach(() => {
      service['getDcqlCredentialId'] = jest.fn().mockReturnValue('pid-fc');
    });

    it('should key an array of presentations by the credential query id', () => {
      // When
      const result = service['buildDcqlResponsePayload'](
        dcqlRequest,
        { state: 'request-state' } as Openid4vpDeepLinkInterface,
        'vp-token-mock',
      );

      // Then
      expect(result).toEqual({
        state: 'request-state',
        vp_token: { 'pid-fc': ['vp-token-mock'] },
      });
    });
  });

  describe('getDcqlCredentialId', () => {
    it('should return the first credential query id', () => {
      // When
      const result = service['getDcqlCredentialId'](dcqlRequest);

      // Then
      expect(result).toBe('pid-fc');
    });

    it('should throw when the dcql_query has an empty credentials list', () => {
      // Given
      const request = {
        dcql_query: { credentials: [] },
      } as unknown as RequestObjectPayload;

      // When / Then
      expect(() => service['getDcqlCredentialId'](request)).toThrow(
        MockWalletInvalidRequestObjectPayloadException,
      );
    });

    it('should throw when the dcql_query has no credentials', () => {
      // Given
      const request = { dcql_query: {} } as unknown as RequestObjectPayload;

      // When / Then
      expect(() => service['getDcqlCredentialId'](request)).toThrow(
        MockWalletInvalidRequestObjectPayloadException,
      );
    });
  });
});
