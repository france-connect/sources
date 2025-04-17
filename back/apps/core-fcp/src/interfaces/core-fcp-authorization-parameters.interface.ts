import { AuthorizationParameters } from '@fc/oidc-client';

// Kept to prevent re-typing everything in the future if we need to add more parameters
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CoreFcpAuthorizationParametersInterface
  extends AuthorizationParameters {}
