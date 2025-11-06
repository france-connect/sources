import { SignatureDigest } from './signature-digest.enum';

export enum DigestsForAlg {
  ES256 = SignatureDigest.SHA256,
  RS256 = SignatureDigest.SHA256,
  ES384 = SignatureDigest.SHA384,
  ES512 = SignatureDigest.SHA512,
}
