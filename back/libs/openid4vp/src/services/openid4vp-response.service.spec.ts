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
    const requestMock = { state: 'stateMock' } as unknown as Parameters<
      Openid4vpResponseService['parseAuthorizationResponse']
    >[1];

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
    });

    it('should call parseOpenid4vpAuthorizationResponse with the request, response and callbacks', async () => {
      // When
      await service.parseAuthorizationResponse(responseMock, requestMock);

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
      await service.parseAuthorizationResponse(responseMock, requestMock);

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
      await service.parseAuthorizationResponse(responseMock, requestMock);

      // Then
      expect(service.checkDocumentsValidity).toHaveBeenCalledExactlyOnceWith(
        documentsMock,
      );
    });

    it('should return the decoded documents', async () => {
      // When
      const result = await service.parseAuthorizationResponse(
        responseMock,
        requestMock,
      );

      // Then
      expect(result).toBe(documentsMock);
    });

    it('should throw Openid4vpInvalidVpTokenException when the vp_token is missing', async () => {
      // Given
      const missingVpTokenResponseMock = {
        authorizationResponsePayload: {},
      } as unknown as ParsedOpenid4vpAuthorizationResponse;

      parseOpenid4vpAuthorizationResponseMock.mockResolvedValueOnce(
        missingVpTokenResponseMock,
      );

      // When / Then
      await expect(
        service.parseAuthorizationResponse(responseMock, requestMock),
      ).rejects.toThrow(Openid4vpInvalidVpTokenException);
    });

    it('should throw Openid4vpInvalidVpTokenException when the vp_token is not a string', async () => {
      // Given
      const notAStringVpTokenResponseMock = {
        authorizationResponsePayload: { vp_token: { not: 'a string' } },
      } as unknown as ParsedOpenid4vpAuthorizationResponse;

      parseOpenid4vpAuthorizationResponseMock.mockResolvedValueOnce(
        notAStringVpTokenResponseMock,
      );

      // When / Then
      await expect(
        service.parseAuthorizationResponse(responseMock, requestMock),
      ).rejects.toThrow(Openid4vpInvalidVpTokenException);
    });

    it('should throw Openid4vpInvalidVpTokenException when the response payload is missing', async () => {
      // Given
      const missingResponsePayloadResponseMock = {
        authorizationResponsePayload: undefined,
      } as unknown as ParsedOpenid4vpAuthorizationResponse;

      parseOpenid4vpAuthorizationResponseMock.mockResolvedValueOnce(
        missingResponsePayloadResponseMock,
      );

      // When / Then
      await expect(
        service.parseAuthorizationResponse(responseMock, requestMock),
      ).rejects.toThrow(Openid4vpInvalidVpTokenException);
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
    it('should return the vp_token', () => {
      // When
      const result = service['getVpToken'](
        parsedResultMock as unknown as ParsedOpenid4vpAuthorizationResponse,
      );

      // Then
      expect(result).toBe('vpTokenMock');
    });

    it('should throw Openid4vpInvalidVpTokenException when the vp_token is missing', () => {
      // Given
      const missingVpTokenParsedResultMock = {
        authorizationResponsePayload: { not: 'a string' },
      } as unknown as ParsedOpenid4vpAuthorizationResponse;

      // When / Then
      expect(() =>
        service['getVpToken'](missingVpTokenParsedResultMock),
      ).toThrow(Openid4vpInvalidVpTokenException);
    });
  });
});
