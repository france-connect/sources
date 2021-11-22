/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'Lax',
  httpOnly: true,
  secure: true,
  maxAge: 600000, // 10 minutes
  domain: process.env.FQDN,
};

const prefix = '/api/v2';

export default {
  encryptionKey: env.string('USERINFO_CRYPT_KEY'),
  prefix: 'FCP-HIGH-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'fc_session_id',
  lifetime: 600, // 10 minutes
  sessionIdLength: 64,
  excludedRoutes: [`${prefix}${OidcProviderRoutes.AUTHORIZATION}`],
  templateExposed: {
    OidcClient: { spId: true, spName: true },
  },
} as SessionConfig;
