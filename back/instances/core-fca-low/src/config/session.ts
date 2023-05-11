/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { OidcClientRoutes } from '@fc/oidc-client';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

import app from './app';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'Lax',
  httpOnly: true,
  secure: true,
  maxAge: 7200000, // 2h
  domain: process.env.FQDN,
};

export default {
  encryptionKey: env.string('USERINFO_CRYPT_KEY'),
  prefix: 'FCA-LOW-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'fc_session_id',
  lifetime: 7200, // 2h
  sessionIdLength: 64,
  slidingExpiration: true,
  excludedRoutes: [
    `${app.urlPrefix}${OidcProviderRoutes.JWKS}`,
    `${app.urlPrefix}${OidcProviderRoutes.OPENID_CONFIGURATION}`,
    `${app.urlPrefix}${OidcClientRoutes.WELL_KNOWN_KEYS}`,
  ],
} as SessionConfig;
