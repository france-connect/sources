import { JWK } from 'jose';

export interface JwtSignerInterface {
  method: 'jwk';
  publicJwk: JWK;
  alg: string;
}
