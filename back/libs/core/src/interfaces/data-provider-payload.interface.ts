/* istanbul ignore file */

// Declarative file
import { JWTPayload } from 'jose';

export interface TokenIntrospectionInterface {
  active: boolean;
  aud?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  jti?: string;
  acr?: string;
  scope?: string;
  [propName: string]: unknown;
}

export interface DpJwtPayloadInterface extends JWTPayload {
  token_introspection: TokenIntrospectionInterface;
}
