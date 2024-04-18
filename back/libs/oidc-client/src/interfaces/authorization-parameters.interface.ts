/* istanbul ignore file */

// Declarative code
import {
  AuthorizationParameters as BaseAuthorizationParameters,
  ClaimsParameterMember,
} from 'openid-client';

/**
 * This interface limit the claims parameter to be an object type only,
 * whereas openid-client provides a `string | object` type for claims parameter.
 */
export interface AuthorizationParameters extends BaseAuthorizationParameters {
  claims?: {
    // Oidc parameter
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token?: {
      [key: string]: ClaimsParameterMember;
    };
    userinfo?: {
      [key: string]: ClaimsParameterMember;
    };
  };
}
