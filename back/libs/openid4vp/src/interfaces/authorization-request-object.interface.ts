import { createOpenid4vpAuthorizationRequest } from '@openid4vc/openid4vp';

export type AuthorizationRequestObjectInterface = ReturnType<
  typeof createOpenid4vpAuthorizationRequest
>;
