import { createHash, X509Certificate } from 'crypto';

import { KekAlg } from '@fc/cryptography';

import { Openid4vpInvalidX509CertificateChainException } from '../exceptions';
import { X509SigningMaterial } from '../interfaces';

const PEM_CERTIFICATE_PATTERN =
  /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g;

const CLIENT_ID_PREFIX = 'x509_hash:';

export function parsePemCertificateChain(
  certificateChainPem: string,
): X509Certificate[] {
  const blocks = certificateChainPem.match(PEM_CERTIFICATE_PATTERN) ?? [];

  if (blocks.length === 0) {
    throw new Openid4vpInvalidX509CertificateChainException();
  }

  return blocks.map((block: string) => new X509Certificate(block));
}

export function certificateChainToX5c(
  certificates: readonly X509Certificate[],
): string[] {
  return certificates.map((certificate) =>
    Buffer.from(certificate.raw).toString('base64'),
  );
}

export function computeX509HashClientId(
  leafCertificate: X509Certificate,
): string {
  const hash = createHash('sha256')
    .update(leafCertificate.raw)
    .digest('base64url');

  return `${CLIENT_ID_PREFIX}${hash}`;
}

export function loadX509SigningMaterial(
  certificateChainPem: string,
  privateKeyPem: string,
  alg: KekAlg,
): X509SigningMaterial {
  const certificates = parsePemCertificateChain(certificateChainPem);
  const leafCertificate = certificates[0];

  const x5c = certificateChainToX5c(certificates);
  const clientIdHash = computeX509HashClientId(leafCertificate);

  return {
    leafCertificate,
    x5c,
    privateKeyPem,
    alg,
    clientIdHash,
  };
}
