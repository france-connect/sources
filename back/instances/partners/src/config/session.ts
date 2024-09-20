/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { OidcClientRoutes } from '@fc/oidc-client';
import { PartnersSession } from '@fc/partners';
import { PartnersBackRoutes } from '@fc/partners/enums';
import { SessionConfig, SessionCookieOptionsInterface } from '@fc/session';

import I18nConfig from './i18n';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: SessionCookieOptionsInterface = {
  signed: true,
  sameSite: 'strict',
  httpOnly: true,
  secure: true,
  maxAge: 600000, // 10 minutes
  domain: process.env.FQDN,
};

export default {
  encryptionKey: env.string('ENCRYPTION_KEY'),
  prefix: 'PARTNERS-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'partners_session_id',
  lifetime: 600, // 10 minutes
  sessionIdLength: 64,
  slidingExpiration: true,
  middlewareExcludedRoutes: [],
  middlewareIncludedRoutes: [
    // Connection flow
    OidcClientRoutes.REDIRECT_TO_IDP,
    OidcClientRoutes.OIDC_CALLBACK,

    // Business
    PartnersBackRoutes.USER_INFO,
    PartnersBackRoutes.INDEX,

    // Disconnection flow
    PartnersBackRoutes.LOGOUT,
    PartnersBackRoutes.LOGOUT_CALLBACK,

    // Front / Back flow
    PartnersBackRoutes.CSRF_TOKEN,
  ],
  schema: PartnersSession,
  defaultData: {
    I18n: {
      language: I18nConfig.defaultLanguage,
    },
  },
} as SessionConfig;
