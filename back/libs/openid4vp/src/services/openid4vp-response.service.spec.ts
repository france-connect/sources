import type { ParsedOpenid4vpAuthorizationResponse } from '@openid4vc/openid4vp';

import { Test, TestingModule } from '@nestjs/testing';

import { MdocDocumentInterface, MdocService } from '@fc/mdoc';

import { parseOpenid4vpAuthorizationResponse } from '@mocks/openid4vp';

import { Openid4vpInvalidVpTokenException } from '../exceptions';
import { Openid4vpCryptoService } from './openid4vp-crypto.service';
import { Openid4vpResponseService } from './openid4vp-response.service';

describe('Openid4vpResponseService', () => {
  let service: Openid4vpResponseService;

  const cryptoServiceMock = {
    responseCallbacks: Symbol('responseCallbacks'),
  };
  const mdocServiceMock = {
    decodeDeviceResponse: jest.fn(),
    verifyValidityInfo: jest.fn(),
    assertAlgorithmAllowed: jest.fn(),
  };

  const parseOpenid4vpAuthorizationResponseMock = jest.mocked(
    parseOpenid4vpAuthorizationResponse,
  );
  const parsedResultMock = {
    authorizationResponsePayload: { vp_token: 'vpTokenMock' },
  };
  const requestMock = { state: 'stateMock' } as unknown as Parameters<
    Openid4vpResponseService['parseAuthorizationResponse']
  >[1];
  const credentialIdMock = 'pid-fc';

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Openid4vpResponseService,
        Openid4vpCryptoService,
        MdocService,
      ],
    })
      .overrideProvider(Openid4vpCryptoService)
      .useValue(cryptoServiceMock)
      .overrideProvider(MdocService)
      .useValue(mdocServiceMock)
      .compile();

    service = module.get<Openid4vpResponseService>(Openid4vpResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseAuthorizationResponse', () => {
    const responseMock = { vp_token: 'vpTokenMock' } as Record<string, unknown>;

    const documentsMock = [
      {
        issuerSigned: { mso: { validityInfo: { foo: 'bar' } } },
        deviceSigned: { deviceAuth: { algorithm: 'ES256' } },
      },
    ];

    beforeEach(() => {
      parseOpenid4vpAuthorizationResponseMock.mockResolvedValue(
        parsedResultMock as unknown as ParsedOpenid4vpAuthorizationResponse,
      );
      mdocServiceMock.decodeDeviceResponse.mockReturnValue(documentsMock);
      service['getVpToken'] = jest.fn().mockReturnValue('vpTokenMock');
    });

    it('should call parseOpenid4vpAuthorizationResponse with the request, response and callbacks', async () => {
      // When
      await service.parseAuthorizationResponse(
        responseMock,
        requestMock,
        credentialIdMock,
      );

      // Then
      expect(
        parseOpenid4vpAuthorizationResponseMock,
      ).toHaveBeenCalledExactlyOnceWith({
        authorizationRequestPayload: requestMock,
        callbacks: cryptoServiceMock.responseCallbacks,
        authorizationResponse: responseMock,
      });
    });

    it('should decode the vp_token using the mdoc service', async () => {
      // When
      await service.parseAuthorizationResponse(
        responseMock,
        requestMock,
        credentialIdMock,
      );

      // Then
      expect(
        mdocServiceMock.decodeDeviceResponse,
      ).toHaveBeenCalledExactlyOnceWith('vpTokenMock');
    });

    it('should check the validity of every decoded document', async () => {
      // Given
      service.checkDocumentsValidity = jest
        .fn()
        .mockResolvedValue(documentsMock);

      // When
      await service.parseAuthorizationResponse(
        responseMock,
        requestMock,
        credentialIdMock,
      );

      // Then
      expect(service.checkDocumentsValidity).toHaveBeenCalledExactlyOnceWith(
        documentsMock,
      );
    });

    it('should extract the vp_token from the parsed response', async () => {
      // When
      await service.parseAuthorizationResponse(
        responseMock,
        requestMock,
        credentialIdMock,
      );

      // Then
      expect(service['getVpToken']).toHaveBeenCalledExactlyOnceWith(
        parsedResultMock,
        credentialIdMock,
      );
    });

    it('should return the decoded documents', async () => {
      // When
      const result = await service.parseAuthorizationResponse(
        responseMock,
        requestMock,
        credentialIdMock,
      );

      // Then
      expect(result).toBe(documentsMock);
    });
  });

  describe('checkDocumentsValidity', () => {
    const documentsMock = [
      {
        issuerSigned: { mso: { validityInfo: { foo: 'bar' } } },
        deviceSigned: { deviceAuth: { algorithm: 'ES256' } },
      },
      {
        issuerSigned: { mso: { validityInfo: { foo: 'baz' } } },
        deviceSigned: { deviceAuth: { algorithm: 'ES384' } },
      },
    ] as unknown as MdocDocumentInterface[];

    it('should verify the validity info of every document', () => {
      // When
      service.checkDocumentsValidity(documentsMock);

      // Then
      expect(mdocServiceMock.verifyValidityInfo).toHaveBeenCalledTimes(2);
      expect(mdocServiceMock.verifyValidityInfo).toHaveBeenNthCalledWith(
        1,
        documentsMock[0].issuerSigned.mso.validityInfo,
      );
      expect(mdocServiceMock.verifyValidityInfo).toHaveBeenNthCalledWith(
        2,
        documentsMock[1].issuerSigned.mso.validityInfo,
      );
    });

    it('should assert that the device-auth algorithm of every document is allowed', () => {
      // When
      service.checkDocumentsValidity(documentsMock);

      // Then
      expect(mdocServiceMock.assertAlgorithmAllowed).toHaveBeenCalledTimes(2);
      expect(mdocServiceMock.assertAlgorithmAllowed).toHaveBeenNthCalledWith(
        1,
        documentsMock[0].deviceSigned.deviceAuth.algorithm,
      );
      expect(mdocServiceMock.assertAlgorithmAllowed).toHaveBeenNthCalledWith(
        2,
        documentsMock[1].deviceSigned.deviceAuth.algorithm,
      );
    });
  });

  describe('getVpToken', () => {
    beforeEach(() => {
      service['unwrapDcqlVpToken'] = jest
        .fn()
        .mockReturnValue('unwrappedVpToken');
    });

    it('should unwrap the vp_token from the authorization response payload', () => {
      // When
      const result = service['getVpToken'](
        parsedResultMock as unknown as ParsedOpenid4vpAuthorizationResponse,
        credentialIdMock,
      );

      // Then
      expect(service['unwrapDcqlVpToken']).toHaveBeenCalledExactlyOnceWith(
        'vpTokenMock',
        credentialIdMock,
      );
      expect(result).toBe('unwrappedVpToken');
    });

    it('should unwrap an undefined vp_token when the payload is missing', () => {
      // Given
      const missingPayloadResult = {
        authorizationResponsePayload: undefined,
      } as unknown as ParsedOpenid4vpAuthorizationResponse;

      // When
      service['getVpToken'](missingPayloadResult, credentialIdMock);

      // Then
      expect(service['unwrapDcqlVpToken']).toHaveBeenCalledExactlyOnceWith(
        undefined,
        credentialIdMock,
      );
    });
  });

  describe('unwrapDcqlVpToken', () => {
    it('should look up the presentation by the requested credential id', () => {
      // Given
      service['dcqlPresentationByCredentialId'] = jest
        .fn()
        .mockReturnValue('dcqlVpTokenMock');
      const dcqlVpToken = { 'pid-fc': 'dcqlVpTokenMock' };

      // When
      const result = service['unwrapDcqlVpToken'](
        dcqlVpToken,
        credentialIdMock,
      );

      // Then
      expect(
        service['dcqlPresentationByCredentialId'],
      ).toHaveBeenCalledExactlyOnceWith(dcqlVpToken, 'pid-fc');
      expect(result).toBe('dcqlVpTokenMock');
    });

    it('should throw Openid4vpInvalidVpTokenException when the presentation is not a string', () => {
      // Given
      service['dcqlPresentationByCredentialId'] = jest
        .fn()
        .mockReturnValue(undefined);

      // When / Then
      expect(() =>
        service['unwrapDcqlVpToken']({ not: 1 }, credentialIdMock),
      ).toThrow(Openid4vpInvalidVpTokenException);
    });
  });

  describe('dcqlPresentationByCredentialId', () => {
    it('should return undefined when the vp_token is not a record', () => {
      // When
      const result = service['dcqlPresentationByCredentialId'](
        ['not-a-record'],
        'pid-fc',
      );

      // Then
      expect(result).toBeUndefined();
    });

    it('should return the presentation matching the requested credential id', () => {
      // When
      const result = service['dcqlPresentationByCredentialId'](
        { 'pid-fc': 'dcqlVpTokenMock', other: 'ignoredVpTokenMock' },
        'pid-fc',
      );

      // Then
      expect(result).toBe('dcqlVpTokenMock');
    });

    it('should return the first presentation of an array', () => {
      // When
      const result = service['dcqlPresentationByCredentialId'](
        { 'pid-fc': ['firstVpToken', 'secondVpToken'] },
        'pid-fc',
      );

      // Then
      expect(result).toBe('firstVpToken');
    });
  });

  describe('isRecord', () => {
    it('should return true for a plain object', () => {
      expect(service['isRecord']({ 'pid-fc': 'x' })).toBe(true);
    });

    it('should return false for null', () => {
      expect(service['isRecord'](null)).toBe(false);
    });

    it('should return false for an array', () => {
      expect(service['isRecord'](['vp'])).toBe(false);
    });

    it('should return false for a string', () => {
      expect(service['isRecord']('vpTokenMock')).toBe(false);
    });
  });
});
