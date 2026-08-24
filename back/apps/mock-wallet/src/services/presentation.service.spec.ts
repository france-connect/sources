import { Test, TestingModule } from '@nestjs/testing';

import { Openid4vpDeepLinkInterface } from '@fc/openid4vp/interfaces';

import {
  PresentationDefinition,
  RequestObjectPayload,
  WalletIdentity,
} from '../interfaces';
import { PresentationService } from './presentation.service';
import { WalletDocumentService } from './wallet-document.service';

describe('PresentationService', () => {
  let service: PresentationService;

  const documentMock = {
    buildVpToken: jest.fn(),
  };

  const definition: PresentationDefinition = {
    id: 'definition-mock',
    input_descriptors: [
      {
        id: 'eu.europa.ec.eudi.pid.1',
        constraints: {
          fields: [
            { path: ["$['eu.europa.ec.eudi.pid.1']['family_name']"] },
            { path: ["$['eu.europa.ec.eudi.pid.1']['given_name']"] },
          ],
        },
      },
    ],
  };

  const identity: WalletIdentity = {
    docType: 'eu.europa.ec.eudi.pid.1',
    attributes: { family_name: 'DUPONT', given_name: 'JEAN', extra: 'x' },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PresentationService, WalletDocumentService],
    })
      .overrideProvider(WalletDocumentService)
      .useValue(documentMock)
      .compile();

    service = module.get<PresentationService>(PresentationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractRequestedClaims', () => {
    it('should extract the claim names from the input descriptors paths', () => {
      // When
      const result = service.extractRequestedClaims(definition);

      // Then
      expect(result).toEqual(['family_name', 'given_name']);
    });

    it('should ignore field paths without a bracketed claim segment', () => {
      // Given
      const definitionWithoutBracket: PresentationDefinition = {
        id: 'def',
        input_descriptors: [
          { id: 'desc', constraints: { fields: [{ path: ['$.simple'] }] } },
        ],
      };

      // When / Then
      expect(service.extractRequestedClaims(definitionWithoutBracket)).toEqual(
        [],
      );
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

  describe('buildPresentationSubmission', () => {
    it('should build a mso_mdoc descriptor map pointing to the vp_token', () => {
      // When
      const result = service.buildPresentationSubmission(definition);

      // Then
      expect(result.definition_id).toBe('definition-mock');
      expect(result.descriptor_map).toEqual([
        {
          id: 'eu.europa.ec.eudi.pid.1',
          format: 'mso_mdoc',
          path: '$.vp_token',
        },
      ]);
      expect(typeof result.id).toBe('string');
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
    const request = {
      state: 'request-state',
      presentation_definition: definition,
    } as RequestObjectPayload;

    beforeEach(() => {
      documentMock.buildVpToken.mockResolvedValue('vp-token-mock');
    });

    it('should build the vp_token from the selected claims', async () => {
      // When
      await service.buildResponsePayload(
        request,
        {} as Openid4vpDeepLinkInterface,
        identity,
      );

      // Then
      expect(documentMock.buildVpToken).toHaveBeenCalledExactlyOnceWith(
        identity,
        { family_name: 'DUPONT', given_name: 'JEAN' },
        request,
      );
    });

    it('should assemble the full wallet response payload', async () => {
      // When
      const result = await service.buildResponsePayload(
        request,
        {} as Openid4vpDeepLinkInterface,
        identity,
      );

      // Then
      expect(result.state).toBe('request-state');
      expect(result.vp_token).toBe('vp-token-mock');
      expect(result.presentation_submission.definition_id).toBe(
        'definition-mock',
      );
    });
  });

  describe('descriptorPaths', () => {
    it('should return an empty array when the descriptor has no fields', () => {
      // When
      const result = service['descriptorPaths']({
        id: 'desc',
        constraints: {},
      });

      // Then
      expect(result).toEqual([]);
    });
  });
});
