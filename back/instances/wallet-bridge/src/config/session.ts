import { ConfigParser } from '@fc/config';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { SessionConfig, SessionCookieOptionsInterface } from '@fc/session';
import { WalletBridgeRoutes, WalletBridgeSession } from '@fc/wallet-bridge';

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
    WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REQUEST_URI,
    WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REQUEST_STATUS,
    WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REDIRECT,
    WalletBridgeRoutes.OIDC_INTERACTION,
    OidcProviderRoutes.AUTHORIZATION,
    OidcProviderRoutes.USERINFO,
  ],
  schema: WalletBridgeSession,
  defaultData: {
    I18n: {
      language: I18nConfig.defaultLanguage,
    },
    Openid4vp: {
      interactions: [],
    },
  },
} as SessionConfig;
