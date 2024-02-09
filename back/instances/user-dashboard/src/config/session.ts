/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { OidcClientRoutes } from '@fc/oidc-client';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';
import { UserDashboardSession } from '@fc/user-dashboard';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'Strict',
  httpOnly: true,
  secure: true,
  maxAge: 600000, // 10 minutes
  domain: process.env.FQDN,
};

export default {
  encryptionKey: env.string('ENCRYPTION_KEY'),
  prefix: 'USER-DASHBOARD-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'ud_session_id',
  lifetime: 600, // 10 minutes
  sessionIdLength: 64,
  slidingExpiration: true,
  excludedRoutes: [OidcClientRoutes.WELL_KNOWN_KEYS],
  schema: UserDashboardSession,
} as SessionConfig;
