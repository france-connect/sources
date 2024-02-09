/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { CoreFcpSession } from '@fc/core-fcp';
import { OidcClientRoutes } from '@fc/oidc-client';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'Lax',
  httpOnly: true,
  secure: true,
  maxAge: 1800000, // 30 minutes
  domain: process.env.FQDN,
};

export default {
  encryptionKey: env.string('USERINFO_CRYPT_KEY'),
  prefix: 'FCP-LOW-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'fc_session_id',
  lifetime: 1800, // 30 minutes
  sessionIdLength: 64,
  slidingExpiration: true,
  excludedRoutes: [
    OidcProviderRoutes.JWKS,
    OidcProviderRoutes.OPENID_CONFIGURATION,
    OidcProviderRoutes.END_SESSION_CONFIRMATION,
    OidcClientRoutes.WELL_KNOWN_KEYS,
  ],
  templateExposed: {
    OidcClient: { spId: true, spName: true, idpName: true, idpLabel: true },
  },
  schema: CoreFcpSession,
} as SessionConfig;
