/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { MockIdentityProviderSession } from '@fc/mock-identity-provider';
import { MockIdentityProviderRoutes } from '@fc/mock-identity-provider/enums';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  maxAge: 600000, // 10 minutes
  domain: process.env.FQDN,
};

export default {
  encryptionKey: env.string('USERINFO_CRYPT_KEY'),
  prefix: 'MOCK-FIA-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'idp_session_id',
  lifetime: 600, // 10 minutes
  sessionIdLength: 64,
  slidingExpiration: true,
  middlewareExcludedRoutes: [OidcProviderRoutes.END_SESSION_CONFIRMATION],
  middlewareIncludedRoutes: [
    // Connect flow
    OidcProviderRoutes.AUTHORIZATION,
    MockIdentityProviderRoutes.INDEX,
    MockIdentityProviderRoutes.INTERACTION,
    MockIdentityProviderRoutes.INTERACTION_LOGIN,
    MockIdentityProviderRoutes.INTERACTION_LOGIN_CUSTOM,

    // Disconnect flow
    OidcProviderRoutes.END_SESSION,
  ],
  schema: MockIdentityProviderSession,
  defaultData: {},
} as SessionConfig;
