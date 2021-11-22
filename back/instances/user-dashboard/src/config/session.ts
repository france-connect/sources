/* istanbul ignore file */

// Tested by DTO
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

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
  excludedRoutes: [],
} as SessionConfig;
