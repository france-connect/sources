export enum CoreRoutes {
  DEFAULT = '/',
  INTERACTION = '/interaction/:uid',
  INTERACTION_VERIFY = '/interaction/:uid/verify',
  INTERACTION_CONSENT = '/interaction/:uid/consent',
  INTERACTION_LOGIN = '/login',
  JWKS_URI = '/jwks',
  REDIRECT_TO_SP_WITH_ERROR = '/redirect-to-sp-with-error',
}
