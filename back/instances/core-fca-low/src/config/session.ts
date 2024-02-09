/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { CoreFcaSession } from '@fc/core-fca';
import { OidcClientRoutes } from '@fc/oidc-client';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'Lax',
  httpOnly: true,
  secure: true,
  maxAge: 43200000, // 12h
  domain: process.env.FQDN,
};

export default {
  encryptionKey: env.string('USERINFO_CRYPT_KEY'),
  prefix: 'FCA-LOW-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'fc_session_id',
  lifetime: 43200, // 12h
  sessionIdLength: 64,
  slidingExpiration: false,
  excludedRoutes: [
    OidcProviderRoutes.JWKS,
    OidcProviderRoutes.OPENID_CONFIGURATION,
    OidcProviderRoutes.END_SESSION_CONFIRMATION,
    OidcClientRoutes.WELL_KNOWN_KEYS,
  ],
  schema: CoreFcaSession,
} as SessionConfig;
