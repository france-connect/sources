import { X509Certificate } from 'crypto';

export interface X509SigningMaterial {
  readonly leafCertificate: X509Certificate;
  readonly x5c: string[];
  readonly privateKeyPem: string;
  readonly alg: string;
  readonly clientIdHash: string;
}
