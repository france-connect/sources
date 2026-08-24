import { createHash, Hash, X509Certificate } from 'crypto';

import { KekAlg } from '@fc/cryptography';

import { Openid4vpClientIdPrefixEnum } from '../enums';
import { Openid4vpInvalidX509CertificateChainException } from '../exceptions';
import {
  certificateChainToX5c,
  computeX509HashClientId,
  loadX509SigningMaterial,
  parsePemCertificateChain,
} from './x509-certificate.helper';

jest.mock('crypto', () => ({
  createHash: jest.fn(),
  X509Certificate: jest.fn(),
}));

describe('x509-certificate.helper', () => {
  const X509CertificateMock = jest.mocked(X509Certificate);
  const certificateChainPem =
    '-----BEGIN CERTIFICATE-----loremipsum-----END CERTIFICATE-----';

  const buffer = Buffer.from(certificateChainPem);
  const createHashMock = jest.mocked(createHash);
  const digestMock = 'DIGEST_MOCK';
  const base64DigestMock =
    'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tbG9yZW1pcHN1bS0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0=';

  beforeEach(() => {
    X509CertificateMock.mockImplementation(
      () =>
        ({
          raw: buffer,
        }) as unknown as X509Certificate,
    );

    createHashMock.mockImplementation(
      () =>
        ({
          update: jest.fn(),
          digest: jest.fn(),
        }) as unknown as Hash,
    );

    createHashMock.mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(digestMock),
    } as unknown as Hash);
  });

  describe('parsePemCertificateChain', () => {
    it('should parse a PEM certificate chain', () => {
      // When
      const result = parsePemCertificateChain(certificateChainPem);

      // Then
      expect(result).toEqual([{ raw: buffer }]);
    });

    it('should throw Openid4vpInvalidX509CertificateChainException when the certificate chain is empty', () => {
      // Given
      const certificateChainPem = '';

      // When / Then
      expect(() => parsePemCertificateChain(certificateChainPem)).toThrow(
        Openid4vpInvalidX509CertificateChainException,
      );
    });
  });

  describe('certificateChainToX5c', () => {
    it('should convert a certificate chain to a X.509 certificate chain', () => {
      // Given
      const certificateChain = [
        { raw: buffer },
      ] as unknown as X509Certificate[];

      // When
      const result = certificateChainToX5c(certificateChain);

      // Then
      expect(result).toEqual([base64DigestMock]);
    });
  });

  describe('computeX509HashClientId', () => {
    it('should compute the X.509 hash client ID', () => {
      // Given
      const certificate = { raw: buffer } as unknown as X509Certificate;

      // When
      const result = computeX509HashClientId(certificate);

      // Then
      expect(result).toEqual(
        `${Openid4vpClientIdPrefixEnum.X509_HASH}${digestMock}`,
      );
    });
  });

  describe('loadX509SigningMaterial', () => {
    it('should return the X.509 signing material', () => {
      // Given
      const alg = KekAlg.RS256;
      const privateKeyPem =
        '-----BEGIN PRIVATE KEY-----loremipsum-----END PRIVATE KEY-----';

      // When
      const result = loadX509SigningMaterial(
        certificateChainPem,
        privateKeyPem,
        alg,
      );

      // Then
      expect(result).toEqual({
        leafCertificate: { raw: buffer },
        x5c: [base64DigestMock],
        privateKeyPem,
        alg,
        clientIdHash: `${Openid4vpClientIdPrefixEnum.X509_HASH}${digestMock}`,
      });
    });
  });
});
