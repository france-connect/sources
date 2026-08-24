import { Test, TestingModule } from '@nestjs/testing';

import { MdocAlgorithmsEnum } from '../enums';
import { buildMdocVpToken as buildMdocVpTokenHelper } from '../helpers';
import {
  BuildMdocVpTokenOptions,
  MdocValidityInfoInterface,
} from '../interfaces';
import { MdocService } from './mdoc.service';
import { MdocDecoderService } from './mdoc-decoder.service';
import { MdocVerifierService } from './mdoc-verifier.service';

jest.mock('../helpers/build-mdoc-vp-token.helper', () => ({
  buildMdocVpToken: jest.fn(),
}));

describe('MdocService', () => {
  let service: MdocService;

  const decoderMock = {
    decodeDeviceResponse: jest.fn(),
  };
  const verifierMock = {
    assertAlgorithmAllowed: jest.fn(),
    verifyValidityInfo: jest.fn(),
  };

  const buildMdocVpTokenMock = jest.mocked(buildMdocVpTokenHelper);

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MdocService, MdocDecoderService, MdocVerifierService],
    })
      .overrideProvider(MdocDecoderService)
      .useValue(decoderMock)
      .overrideProvider(MdocVerifierService)
      .useValue(verifierMock)
      .compile();

    service = module.get<MdocService>(MdocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('decodeDeviceResponse', () => {
    it('should decode device response', () => {
      // When
      service.decodeDeviceResponse('token');

      // Then
      expect(decoderMock.decodeDeviceResponse).toHaveBeenCalledWith('token');
    });

    it('should return decoded documents', () => {
      // Given
      const expectedResult = [{ docType: 'x' }];
      decoderMock.decodeDeviceResponse.mockReturnValueOnce(expectedResult);

      // When
      const result = service.decodeDeviceResponse('token');

      // Then
      expect(result).toBe(expectedResult);
    });
  });

  describe('assertAlgorithmAllowed', () => {
    it('should verify algorithm is allowed', () => {
      // Given
      const algorithm = MdocAlgorithmsEnum.ES256;

      // When
      service.assertAlgorithmAllowed(algorithm);

      // Then
      expect(verifierMock.assertAlgorithmAllowed).toHaveBeenCalledWith(
        algorithm,
      );
    });
  });

  describe('verifyValidityInfo', () => {
    it('should verify validity info', () => {
      // Given
      const validityInfo = {} as MdocValidityInfoInterface;
      const now = new Date('2026-06-01T00:00:00.000Z');

      // When
      service.verifyValidityInfo(validityInfo, now);

      // Then
      expect(verifierMock.verifyValidityInfo).toHaveBeenCalledWith(
        validityInfo,
        now,
      );
    });
  });

  describe('buildMdocVpToken', () => {
    it('should delegate to the mdoc builder helper', async () => {
      // Given
      const options: BuildMdocVpTokenOptions = {
        docType: 'eu.europa.ec.eudi.pid.1',
        claims: {
          family_name: 'DUPONT',
          given_name: 'JEAN',
          birth_date: '1985-06-15',
          birth_place: 'Paris',
          nationality: 'FR',
        },
        issuerPrivateKeyPem: 'issuer-key-pem',
        issuerCertificatePem: 'issuer-cert-pem',
        devicePrivateKeyJwk: { kty: 'EC', d: 'private' },
        deviceCertificatePem: 'device-cert-pem',
        openid4vpSession: {
          clientId: 'https://verifier.example/response',
          nonce: 'nonce-mock',
          responseUri: 'https://verifier.example/response',
        },
      };
      buildMdocVpTokenMock.mockResolvedValue('vp-token-mock');

      // When
      const result = await service.buildMdocVpToken(options);

      // Then
      expect(result).toBe('vp-token-mock');
      expect(buildMdocVpTokenMock).toHaveBeenCalledExactlyOnceWith(options);
    });
  });
});
