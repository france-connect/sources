import { OidcClaims } from './oidc-claims.interface';

export interface IdentityFixture extends OidcClaims {
  password: string;
}
