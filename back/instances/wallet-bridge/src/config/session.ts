import { ConfigParser } from '@fc/config';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { SessionConfig, SessionCookieOptionsInterface } from '@fc/session';
import { Routes, WalletBridgeSession } from '@fc/wallet-bridge';

import App from './app';
import I18nConfig from './i18n';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: SessionCookieOptionsInterface = {
  signed: true,
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  maxAge: 600000, // 10 minutes
  domain: App.fqdn,
};

export default {
  encryptionKey: env.string('ENCRYPTION_KEY'),
  prefix: 'WBSID',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'wb_sid',
  lifetime: 600, // 10 minutes
  sessionIdLength: 64,
  slidingExpiration: true,
  middlewareExcludedRoutes: [],
  middlewareIncludedRoutes: [
    Routes.OPENID4VP_AUTHORIZE_CREATE_INTERACTION,
    Routes.OPENID4VP_AUTHORIZE_REQUEST_URI,
    Routes.OPENID4VP_AUTHORIZE_REQUEST_STATUS,
    Routes.OPENID4VP_AUTHORIZE_REDIRECT,
    Routes.OIDC_INTERACTION,
    OidcProviderRoutes.AUTHORIZATION,
    OidcProviderRoutes.USERINFO,
  ],
  schema: WalletBridgeSession,
  defaultData: {
    I18n: {
      language: I18nConfig.defaultLanguage,
    },
    openid4vp: {
      interactions: [],
    },
  },
} as SessionConfig;
