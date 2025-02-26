import { ConfigParser } from '@fc/config';
import { PartnersSession } from '@fc/partners';
import { SessionConfig, SessionCookieOptionsInterface } from '@fc/session';

import I18nConfig from './i18n';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: SessionCookieOptionsInterface = {
  signed: true,
  sameSite: 'lax',
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
  middlewareIncludedRoutes: ['*'],
  schema: PartnersSession,
  defaultData: {
    I18n: {
      language: I18nConfig.defaultLanguage,
    },
  },
} as SessionConfig;
