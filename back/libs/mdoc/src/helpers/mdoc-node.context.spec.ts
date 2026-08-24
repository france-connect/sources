import { CoseKey } from '@owf/mdoc';
import { exportJWK, importPKCS8 } from 'jose';

import { JwkHelper } from '@fc/jwt';

import { MdocNotImplementedException } from '../exceptions';
import {
  createNodeMdocContext,
  getCertificateDerBase64,
  getIssuerCertificateRaw,
  toPublicJwk,
} from './mdoc-node.context';

jest.mock('@owf/mdoc', () => ({
  CoseKey: { fromJwk: jest.fn() },
}));

jest.mock('jose', () => ({
  importPKCS8: jest.fn(),
  exportJWK: jest.fn(),
}));

jest.mock('@fc/jwt', () => ({
  JwkHelper: { publicFromPrivate: jest.fn() },
}));

const ISSUER_CERTIFICATE_PEM = `-----BEGIN CERTIFICATE-----
MIICKjCCAdCgAwIBAgIUV8bM0wi95D7KN0TyqHE42ru4hOgwCgYIKoZIzj0EAwIw
UzELMAkGA1UEBhMCVVMxETAPBgNVBAgMCE5ldyBZb3JrMQ8wDQYDVQQHDAZBbGJh
bnkxDzANBgNVBAoMBk5ZIERNVjEPMA0GA1UECwwGTlkgRE1W
MB4XDTIzMDkxNDE0NTUxOFoXDTMzMDkxMTE0NTUxOFowUzELMAkGA1UEBhMCVVMxETAPBgNVBAgMCE5l
dyBZb3JrMQ8wDQYDVQQHDAZBbGJhbnkxDzANBgNVBAoMBk5ZIERNVjEPMA0GA1UE
CwwGTlkgRE1WMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEiTwtg0eQbcbNabf2
Nq9L/VM/lhhPCq2s0Qgw2kRx29tgrBcNHPxTT64tnc1Ij3dH/fl42SXqMenpCDw4
K6ntU6OBgTB/MB0GA1UdDgQWBBSrbS4DuR1JIkAzj7zK3v2TM+r2xzAfBgNVHSME
GDAWgBSrbS4DuR1JIkAzj7zK3v2TM+r2xzAPBgNVHRMBAf8EBTADAQH/MCwGCWCG
SAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAKBggqhkjO
PQQDAgNIADBFAiAJ/Qyrl7A+ePZOdNfc7ohmjEdqCvxaos6//gfTvncuqQIhANo4
q8mKCA9J8k/+zh//yKbN1bLAtdqPx7dnrDqV3Lg+
-----END CERTIFICATE-----`;

describe('mdoc-node.context', () => {
  const importPKCS8Mock = jest.mocked(importPKCS8);
  const exportJWKMock = jest.mocked(exportJWK);

  beforeEach(() => {
    jest.resetAllMocks();
    importPKCS8Mock.mockResolvedValue({ privateKey: true } as never);
    exportJWKMock.mockResolvedValue({ kty: 'EC' } as never);
    jest.mocked(CoseKey.fromJwk).mockReturnValue({
      privateKey: Buffer.from('ab'),
    } as never);
  });

  describe('getIssuerCertificateRaw', () => {
    it('should return the raw issuer certificate bytes', () => {
      // When
      const result = getIssuerCertificateRaw(ISSUER_CERTIFICATE_PEM);

      // Then
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getCertificateDerBase64', () => {
    it('should return the DER certificate encoded in base64', () => {
      // When
      const result = getCertificateDerBase64(ISSUER_CERTIFICATE_PEM);

      // Then
      expect(typeof result).toBe('string');
      expect(Buffer.from(result, 'base64')).toEqual(
        Buffer.from(getIssuerCertificateRaw(ISSUER_CERTIFICATE_PEM)),
      );
    });
  });

  describe('toPublicJwk', () => {
    it('should delegate to JwkHelper.publicFromPrivate', async () => {
      // Given
      const resultMock = { kty: 'EC', x: 'abc' };
      jest.mocked(JwkHelper.publicFromPrivate).mockResolvedValue(resultMock);
      const privateJwk = {
        kty: 'EC',
        x: 'abc',
        d: 'secret',
      };

      // When
      const result = await toPublicJwk(privateJwk);

      // Then
      expect(result).toBe(resultMock);
    });
  });

  describe('createNodeMdocContext', () => {
    it('should expose crypto and cose helpers for fixture issuance', async () => {
      // Given
      const context = createNodeMdocContext();
      const certificateRaw = getIssuerCertificateRaw(ISSUER_CERTIFICATE_PEM);
      const bytes = new Uint8Array([1, 2, 3]);

      // When
      const digest = await context.crypto.digest({
        digestAlgorithm: 'SHA-256',
        bytes,
      });
      const random = context.crypto.random(4);
      const mac = await context.cose.mac0.sign({
        key: { privateKey: Buffer.from('secret') } as unknown as CoseKey,
        toBeAuthenticated: bytes,
      });
      const signature = await context.cose.sign1.sign({
        toBeSigned: bytes,
        key: {
          jwk: {
            kty: 'EC',
            crv: 'P-256',
            x: 'WbQKKkp7elErO7kCubDYxBVnObCsAzVITQAjHcef0Z0',
            y: '3_nBqZpGxNzWwsf4QsGVXCozyth_8vDc8GvFTYWlEkY',
            d: 'p33vkizAZhyMNJyBSwgJ7E-4dcbA5fMd9yaCjq0LWms',
          },
        } as unknown as CoseKey,
      });
      const issuerField = context.x509.getIssuerNameField({
        certificate: certificateRaw,
        field: 'C',
      });
      const publicKey = await context.x509.getPublicKey({
        certificate: certificateRaw,
        alg: 'ES256',
      });
      const certificateData = await context.x509.getCertificateData({
        certificate: certificateRaw,
      });

      // Then
      expect(digest).toBeInstanceOf(Uint8Array);
      expect(random).toHaveLength(4);
      expect(mac).toBeInstanceOf(Buffer);
      expect(signature).toBeInstanceOf(Uint8Array);
      expect(issuerField.length).toBeGreaterThan(0);
      expect(publicKey).toBeDefined();
      expect(certificateData.pem).toContain('BEGIN CERTIFICATE');
    });

    it('should reject calculateEphemeralMacKey with MdocNotImplementedException', async () => {
      // Given
      const context = createNodeMdocContext();

      // When / Then
      await expect(context.crypto.calculateEphemeralMacKey()).rejects.toThrow(
        MdocNotImplementedException,
      );
    });

    it('should reject mac0.verify with MdocNotImplementedException', async () => {
      // Given
      const context = createNodeMdocContext();

      // When / Then
      await expect(context.cose.mac0.verify()).rejects.toThrow(
        MdocNotImplementedException,
      );
    });

    it('should reject sign1.verify with MdocNotImplementedException', async () => {
      // Given
      const context = createNodeMdocContext();

      // When / Then
      await expect(context.cose.sign1.verify()).rejects.toThrow(
        MdocNotImplementedException,
      );
    });

    it('should reject verifyCertificateChain with MdocNotImplementedException', async () => {
      // Given
      const context = createNodeMdocContext();

      // When / Then
      await expect(context.x509.verifyCertificateChain()).rejects.toThrow(
        MdocNotImplementedException,
      );
    });

    it('should return an empty issuer field when it is absent from the certificate', () => {
      // Given
      const context = createNodeMdocContext();

      // When
      const result = context.x509.getIssuerNameField({
        certificate: getIssuerCertificateRaw(ISSUER_CERTIFICATE_PEM),
        field: 'missing-field',
      });

      // Then
      expect(result).toEqual([]);
    });
  });
});
