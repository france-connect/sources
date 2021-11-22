export enum MockServiceProviderRoutes {
  LOGIN = '/login',
  LOGIN_CALLBACK = '/login-callback',
  LOGOUT = '/logout',
  LOGOUT_CALLBACK = '/logout-callback',
  REVOCATION = '/revocation',
  USERINFO = '/me',
  VERIFY = '/interaction/:uid/verify',
  ERROR = '/error',
  WELL_KNOWN_KEYS = '/.well-known/keys',
}
