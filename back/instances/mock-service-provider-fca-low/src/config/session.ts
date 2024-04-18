/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { MockServiceProviderSession } from '@fc/mock-service-provider';
import { MockServiceProviderRoutes } from '@fc/mock-service-provider/enums';
import { OidcClientRoutes } from '@fc/oidc-client';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  maxAge: 600000, // 10 minutes
  domain: env.string('FQDN'),
};

export default {
  encryptionKey: env.string('USERINFO_CRYPT_KEY'),
  prefix: 'MOCK-FCA-SP-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'sp_session_id',
  lifetime: 600, // 10 minutes
  sessionIdLength: 64,
  slidingExpiration: true,
  middlewareExcludedRoutes: [],
  middlewareIncludedRoutes: [
    // Connect flow
    MockServiceProviderRoutes.INDEX,
    OidcClientRoutes.REDIRECT_TO_IDP,
    OidcClientRoutes.OIDC_CALLBACK,
    MockServiceProviderRoutes.LOGIN,
    MockServiceProviderRoutes.LOGIN_CALLBACK,
    MockServiceProviderRoutes.REVOCATION,
    MockServiceProviderRoutes.USERINFO,
    MockServiceProviderRoutes.DATA,
    MockServiceProviderRoutes.VERIFY,
    MockServiceProviderRoutes.ERROR,
    // Disconnect flow
    OidcClientRoutes.DISCONNECT_FROM_IDP,
    OidcClientRoutes.CLIENT_LOGOUT_CALLBACK,
    MockServiceProviderRoutes.LOGOUT,
    MockServiceProviderRoutes.LOGOUT_CALLBACK,
  ],
  schema: MockServiceProviderSession,
  defaultData: {},
} as SessionConfig;
