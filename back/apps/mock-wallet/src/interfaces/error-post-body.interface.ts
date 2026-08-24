import { Openid4vpAuthorizationError } from '@fc/openid4vp/enums';

export interface ErrorPostBodyInterface {
  readonly state?: string;
  readonly error: Openid4vpAuthorizationError;
  readonly error_description: string;
}
