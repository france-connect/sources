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
import {
  createNodeMdocContext,
  getCertificateDerBase64,
  getIssuerCertificateRaw,
  toPublicJwk,
} from './mdoc-node.context';

/**
 * Builds a base64url mdoc `vp_token` (DeviceResponse) for dev mocks.
 *
 * Uses `@owf/mdoc` `encodedForOid4Vp` (wire format expected in OpenID4VP presentations).
 * Issuer and device signatures are both generated from the supplied configuration.
 */
export async function buildMdocVpToken(
  options: BuildMdocVpTokenOptions,
): Promise<string> {
  const {
    docType,
    claims,
    issuerPrivateKeyPem,
    issuerCertificatePem,
    devicePrivateKeyJwk,
    deviceCertificatePem,
    openid4vpSession,
  } = options;

  const mdocContext = createNodeMdocContext();

  const signed = new Date();
  const validFrom = new Date(signed);
  const validUntil = new Date(signed);
  validUntil.setFullYear(validUntil.getFullYear() + 5);

  const issuerPrivateKey = await importPKCS8(issuerPrivateKeyPem, 'ES256');
  const issuerSigningKey = CoseKey.fromJwk(
    (await exportJWK(issuerPrivateKey)) as unknown as Record<string, unknown>,
  );
  const deviceSigningKey = CoseKey.fromJwk(devicePrivateKeyJwk);
  const devicePublicJwk = await toPublicJwk(devicePrivateKeyJwk);

  const issuerSigned = await new IssuerSignedBuilder(docType, mdocContext)
    .addIssuerNamespace(docType, claims)
    .sign({
      signingKey: issuerSigningKey,
      certificates: [getIssuerCertificateRaw(issuerCertificatePem)],
      algorithm: SignatureAlgorithm.ES256,
      digestAlgorithm: 'SHA-256',
      deviceKeyInfo: { deviceKey: DeviceKey.fromJwk(devicePublicJwk) },
      validityInfo: { signed, validFrom, validUntil },
    });

  const sessionTranscript = await SessionTranscript.forOid4Vp(
    {
      clientId: openid4vpSession.clientId,
      nonce: openid4vpSession.nonce,
      responseUri: openid4vpSession.responseUri,
    },
    mdocContext as Pick<ReturnType<typeof createNodeMdocContext>, 'crypto'>,
  );

  const deviceSigned = await new DeviceSignedBuilder(docType, mdocContext).sign(
    {
      signingKey: deviceSigningKey,
      algorithm: SignatureAlgorithm.ES256,
      sessionTranscript,
      derCertificate: getCertificateDerBase64(deviceCertificatePem),
    },
  );

  const document = Document.create({
    docType,
    issuerSigned,
    deviceSigned,
  });

  const deviceResponse = DeviceResponse.createSimple({
    version: '1.0',
    status: 0,
    documents: [document],
  });

  const vpToken = deviceResponse.encodedForOid4Vp;

  return vpToken;
}
