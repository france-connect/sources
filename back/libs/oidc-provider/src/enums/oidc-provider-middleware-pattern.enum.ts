/**
 * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#pre--and-post-middlewares
 */
export const enum OidcProviderMiddlewarePattern {
  AUTHORIZATION = 'authorization',
  CHECK_SESSION_ORIGIN = 'check_session_origin',
  CHECK_SESSION = 'check_session',
  CLIENT_DELETE = 'client_delete',
  CLIENT_UPDATE = 'client_update',
  CLIENT = 'client',
  CODE_VERIFICATION = 'code_verification',
  CORS_DEVICE_AUTHORIZATION = 'cors.device_authorization',
  CORS_DISCOVERY = 'cors.discovery',
  CORS_INTROSPECTION = 'cors.introspection',
  CORS_JWKS = 'cors.jwks',
  CORS_PUSHED_AUTHORIZATION_REQUEST = 'cors.pushed_authorization_request',
  CORS_REVOCATION = 'cors.revocation',
  CORS_TOKEN = 'cors.token',
  CORS_USERINFO = 'cors.userinfo',
  DEVICE_AUTHORIZATION = 'device_authorization',
  DEVICE_RESUME = 'device_resume',
  DISCOVERY = 'discovery',
  END_SESSION_CONFIRM = 'end_session_confirm',
  END_SESSION_SUCCESS = 'end_session_success',
  END_SESSION = 'end_session',
  INTROSPECTION = 'introspection',
  JWKS = 'jwks',
  PUSHED_AUTHORIZATION_REQUEST = 'pushed_authorization_request',
  REGISTRATION = 'registration',
  RESUME = 'resume',
  REVOCATION = 'revocation',
  TOKEN = 'token',
  USERINFO = 'userinfo',
}
