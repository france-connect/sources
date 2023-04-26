/* istanbul ignore file */

// Tested by DTO
import { OidcClientRoutes } from '@fc/oidc-client';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

import app from './app';

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'Strict',
  httpOnly: true,
  secure: true,
  maxAge: 600000, // 10 minutes
  domain: process.env.FQDN,
};

export default {
  encryptionKey: process.env.USERINFO_CRYPT_KEY,
  prefix: 'USER-DASHBOARD-SESS:',
  cookieOptions,
  cookieSecrets: JSON.parse(process.env.SESSION_COOKIE_SECRETS),
  sessionCookieName: 'sp_session_id',
  lifetime: 600, // 10 minutes
  sessionIdLength: 64,
  slidingExpiration: true,
  excludedRoutes: [`${app.urlPrefix}${OidcClientRoutes.WELL_KNOWN_KEYS}`],
} as SessionConfig;
