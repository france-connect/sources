import { CoseKey, SignatureAlgorithm } from '@owf/mdoc';
import { exportJWK, JWK } from 'jose';
import {
  createHmac,
  createPrivateKey,
  JsonWebKey,
  KeyObject,
  randomFillSync,
  sign,
  subtle,
  X509Certificate,
} from 'node:crypto';

import { JwkHelper } from '@fc/jwt';

import { MdocNotImplementedException } from '../exceptions';

export async function nodeMdocDigest(input: {
  digestAlgorithm: string;
  bytes: Uint8Array;
}): Promise<Uint8Array> {
  const digest = await subtle.digest(input.digestAlgorithm, input.bytes);

  return new Uint8Array(digest);
}

export function nodeMdocRandom(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  randomFillSync(bytes);

  return bytes;
}

export function nodeMdocMac0Authenticate(input: {
  toBeAuthenticated: Uint8Array;
  key: CoseKey | Uint8Array;
}): Promise<Uint8Array> {
  const keyBytes =
    input.key instanceof Uint8Array ? input.key : input.key.privateKey;

  return Promise.resolve(
    createHmac('sha256', Buffer.from(keyBytes))
      .update(input.toBeAuthenticated)
      .digest(),
  );
}

export function nodeMdocMac0Verify(_input?: {
  toBeAuthenticated: Uint8Array;
  tag: Uint8Array;
  key: CoseKey | Uint8Array;
}): Promise<boolean> {
  return Promise.reject(new MdocNotImplementedException('mac0.verify'));
}

export function nodeMdocSign1Sign(input: {
  toBeSigned: Uint8Array;
  key: CoseKey;
}): Promise<Uint8Array> {
  const nodePrivateKey = createPrivateKey({
    key: input.key.jwk as JsonWebKey,
    format: 'jwk',
  });

  return Promise.resolve(
    new Uint8Array(
      sign('sha256', Buffer.from(input.toBeSigned), {
        key: nodePrivateKey,
        dsaEncoding: 'ieee-p1363',
      }),
    ),
  );
}

export function nodeMdocSign1Verify(_input?: {
  toBeVerified: Uint8Array;
  signature: Uint8Array;
  key: CoseKey;
  algorithm?: SignatureAlgorithm;
}): Promise<boolean> {
  return Promise.reject(new MdocNotImplementedException('sign1.verify'));
}

export function nodeMdocHdkf(_input: {
  digestAlgorithm?: string;
  privateKey: Uint8Array;
  publicKey: Uint8Array;
  salt: Uint8Array;
  info: Uint8Array;
}): Promise<Uint8Array> {
  return Promise.reject(new MdocNotImplementedException('crypto.hdkf'));
}

export function nodeMdocGetIssuerNameField(input: {
  certificate: Uint8Array;
  field: string;
}): string[] {
  const certificate = new X509Certificate(input.certificate);
  const fieldPrefix = `${input.field}=`;
  const match = certificate.issuer
    .split(',')
    .map((part) => part.trim())
    .find((part) => part.startsWith(fieldPrefix));

  return match ? [match.slice(fieldPrefix.length)] : [];
}

export async function nodeMdocGetPublicKey(input: {
  certificate: Uint8Array;
  alg: string;
}): Promise<CoseKey> {
  const certificate = new X509Certificate(input.certificate);
  const jwk = await exportJWK(certificate.publicKey as KeyObject);

  return CoseKey.fromJwk({
    ...jwk,
    alg: input.alg,
  } as unknown as Record<string, unknown>);
}

export function nodeMdocVerifyCertificateChain(_input?: {
  trustedCertificates: Uint8Array[];
  x5chain: Uint8Array[];
  now?: Date;
}): Promise<void> {
  return Promise.reject(
    new MdocNotImplementedException('x509.verifyCertificateChain'),
  );
}

export function nodeMdocGetCertificateData(input: { certificate: Uint8Array }) {
  const certificate = new X509Certificate(input.certificate);

  return Promise.resolve({
    issuerName: certificate.issuer,
    subjectName: certificate.subject,
    pem: certificate.toString(),
    serialNumber: certificate.serialNumber,
    thumbprint: '',
    notBefore: new Date(certificate.validFrom),
    notAfter: new Date(certificate.validTo),
  });
}

/**
 * Node.js `MdocContext` for `@owf/mdoc` issuance helpers (mock fixtures).
 * Uses `node:crypto` only (no direct `@noble/*` imports).
 */
export function createNodeMdocContext() {
  return {
    crypto: {
      digest: nodeMdocDigest,
      random: nodeMdocRandom,
      hdkf: nodeMdocHdkf,
    },
    cose: {
      mac0: {
        authenticate: nodeMdocMac0Authenticate,
        verify: nodeMdocMac0Verify,
      },
      sign1: {
        sign: nodeMdocSign1Sign,
        verify: nodeMdocSign1Verify,
      },
    },
    x509: {
      getIssuerNameField: nodeMdocGetIssuerNameField,
      getPublicKey: nodeMdocGetPublicKey,
      verifyCertificateChain: nodeMdocVerifyCertificateChain,
      getCertificateData: nodeMdocGetCertificateData,
    },
  };
}

export function getIssuerCertificateRaw(certificatePem: string): Uint8Array {
  return new Uint8Array(new X509Certificate(certificatePem).raw);
}

export function getCertificateDerBase64(certificatePem: string): string {
  return Buffer.from(getIssuerCertificateRaw(certificatePem)).toString(
    'base64',
  );
}

export async function toPublicJwk(
  privateKeyJwk: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const publicJwk = await JwkHelper.publicFromPrivate(
    // Type forced to match external libraries types
    privateKeyJwk as unknown as JWK,
  );

  // Type forced to match external libraries types
  return publicJwk as unknown as Record<string, unknown>;
}
