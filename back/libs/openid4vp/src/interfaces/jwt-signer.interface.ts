import type { JwtSigner } from '@openid4vc/oauth2';
import { JWK } from 'jose';

export type JwtSignerInterface = JwtSigner;

export interface JwtSignerJwkInterface extends JwtSigner {
  method: 'jwk';
  publicJwk: JWK;
  alg: string;
}

export interface JwtSignerX5cInterface extends JwtSigner {
  method: 'x5c';
  x5c: string[];
  alg: string;
}
