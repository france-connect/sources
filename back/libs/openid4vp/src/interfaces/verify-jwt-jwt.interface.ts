import type { JwtHeader, JwtPayload } from '@openid4vc/oauth2';

export interface VerifyJwtJwtInterface {
  header: JwtHeader;
  payload: JwtPayload;
  compact: string;
}
