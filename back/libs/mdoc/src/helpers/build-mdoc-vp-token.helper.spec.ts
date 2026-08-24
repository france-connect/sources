import {
  CoseKey,
  DeviceKey,
  DeviceResponse,
  DeviceSignedBuilder,
  Document,
  IssuerSignedBuilder,
  SessionTranscript,
  SignatureAlgorithm,
} from '@owf/mdoc';
import { exportJWK, importPKCS8 } from 'jose';

import { BuildMdocVpTokenOptions } from '../interfaces';
import { buildMdocVpToken } from './build-mdoc-vp-token.helper';
import { createNodeMdocContext } from './mdoc-node.context';

jest.mock('@owf/mdoc', () => ({
  CoseKey: { fromJwk: jest.fn() },
  DateOnly: jest.fn((value: string) => value),
  DeviceKey: { fromJwk: jest.fn() },
  DeviceResponse: {
    createSimple: jest.fn(),
    fromEncodedForOid4Vp: jest.fn(),
  },
  DeviceSignedBuilder: jest.fn(),
  Document: { create: jest.fn() },
  IssuerSignedBuilder: jest.fn(),
  SessionTranscript: { forOid4Vp: jest.fn() },
  SignatureAlgorithm: { ES256: 'ES256' },
}));

jest.mock('jose', () => ({
  importPKCS8: jest.fn(),
  exportJWK: jest.fn(),
}));

jest.mock('./mdoc-node.context', () => ({
  createNodeMdocContext: jest.fn(),
  getCertificateDerBase64: jest.fn(),
  getIssuerCertificateRaw: jest.fn(),
  toPublicJwk: jest.fn(),
}));

describe('buildMdocVpToken', () => {
  const importPKCS8Mock = jest.mocked(importPKCS8);
  const exportJWKMock = jest.mocked(exportJWK);
  const createNodeMdocContextMock = jest.mocked(createNodeMdocContext);
  const getIssuerCertificateRawMock = jest.mocked(
    jest.requireMock('./mdoc-node.context').getIssuerCertificateRaw,
  );
  const getCertificateDerBase64Mock = jest.mocked(
    jest.requireMock('./mdoc-node.context').getCertificateDerBase64,
  );
  const toPublicJwkMock = jest.mocked(
    jest.requireMock('./mdoc-node.context').toPublicJwk,
  );

  const issuerSignedMock = { issuerSigned: true };
  const deviceSignedMock = { deviceSigned: true };
  const signingKeyMock = { signingKey: true };
  const sessionTranscriptMock = { sessionTranscript: true };

  const buildOptions: BuildMdocVpTokenOptions = {
    docType: 'eu.europa.ec.eudi.pid.1',
    claims: {
      family_name: 'DUPONT',
      given_name: 'JEAN',
      birth_date: '1985-06-15',
      birth_place: 'Paris',
      nationality: ['FR'],
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

  beforeEach(() => {
    jest.resetAllMocks();

    createNodeMdocContextMock.mockReturnValue({ context: true } as never);
    getIssuerCertificateRawMock.mockReturnValue(new Uint8Array([1]));
    getCertificateDerBase64Mock.mockReturnValue('device-cert-der-b64');
    toPublicJwkMock.mockReturnValue({ kty: 'EC' });
    importPKCS8Mock.mockResolvedValue({ privateKey: true } as never);
    exportJWKMock.mockResolvedValue({ kty: 'EC' } as never);
    jest.mocked(CoseKey.fromJwk).mockReturnValue(signingKeyMock as never);
    jest
      .mocked(DeviceKey.fromJwk)
      .mockReturnValue({ deviceKey: true } as never);
    jest
      .mocked(SessionTranscript.forOid4Vp)
      .mockResolvedValue(sessionTranscriptMock as never);

    jest.mocked(IssuerSignedBuilder).mockImplementation(
      () =>
        ({
          addIssuerNamespace: jest.fn().mockReturnThis(),
          sign: jest.fn().mockResolvedValue(issuerSignedMock),
        }) as never,
    );

    jest.mocked(DeviceSignedBuilder).mockImplementation(
      () =>
        ({
          sign: jest.fn().mockResolvedValue(deviceSignedMock),
        }) as never,
    );

    jest.mocked(Document.create).mockReturnValue({ document: true } as never);

    jest.mocked(DeviceResponse.createSimple).mockReturnValue({
      encodedForOid4Vp: 'vp-token-mock',
    } as never);
  });

  it('should pass array nationality through to the issuer namespace', async () => {
    // When
    await buildMdocVpToken({
      ...buildOptions,
      claims: {
        ...buildOptions.claims,
        nationality: ['FR'],
      },
    });

    // Then
    const builderInstance = jest.mocked(IssuerSignedBuilder).mock.results[0]
      .value as {
      addIssuerNamespace: jest.Mock;
    };

    expect(builderInstance.addIssuerNamespace).toHaveBeenCalledWith(
      buildOptions.docType,
      expect.objectContaining({ nationality: ['FR'] }),
    );
  });

  it('should sign issuer and device namespaces with configured keys', async () => {
    // When
    await buildMdocVpToken(buildOptions);

    // Then
    const issuerBuilder = jest.mocked(IssuerSignedBuilder).mock.results[0]
      .value as { sign: jest.Mock };
    const deviceBuilder = jest.mocked(DeviceSignedBuilder).mock.results[0]
      .value as { sign: jest.Mock };

    expect(issuerBuilder.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        signingKey: signingKeyMock,
        certificates: [new Uint8Array([1])],
        algorithm: SignatureAlgorithm.ES256,
        digestAlgorithm: 'SHA-256',
      }),
    );
    expect(deviceBuilder.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        signingKey: signingKeyMock,
        algorithm: SignatureAlgorithm.ES256,
        sessionTranscript: sessionTranscriptMock,
        derCertificate: 'device-cert-der-b64',
      }),
    );
  });
});
