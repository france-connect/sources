/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { MockServiceProviderSession } from '@fc/mock-service-provider';
import { OidcClientRoutes } from '@fc/oidc-client';
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

export default {
  encryptionKey: env.string('USERINFO_CRYPT_KEY'),
  prefix: 'MOCK-FCP-SP-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'sp_session_id',
  lifetime: 600, // 10 minutes
  sessionIdLength: 64,
  slidingExpiration: true,
  excludedRoutes: [OidcClientRoutes.WELL_KNOWN_KEYS],
  schema: MockServiceProviderSession,
} as SessionConfig;
