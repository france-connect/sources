/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { CoreRoutes } from '@fc/core';
import { CoreFcpSession } from '@fc/core-fcp';
import { OidcClientRoutes } from '@fc/oidc-client';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

import I18nConfig from './i18n';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  maxAge: undefined, // Make cookie expire at the end of the browsing session (browser close)
  domain: process.env.FQDN,
};

export default {
  encryptionKey: env.string('USERINFO_CRYPT_KEY'),
  prefix: 'FCP-HIGH-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'fc_session_id',
  lifetime: 600, // 10 minutes
  sessionIdLength: 64,
  slidingExpiration: false,
  middlewareExcludedRoutes: [],
  middlewareIncludedRoutes: [
    // Connect flow
    OidcProviderRoutes.AUTHORIZATION,
    `${CoreRoutes.INTERACTION}$`,
    OidcClientRoutes.REDIRECT_TO_IDP,
    OidcClientRoutes.OIDC_CALLBACK,
    CoreRoutes.INTERACTION_VERIFY,
    CoreRoutes.INTERACTION_CONSENT,
    OidcProviderRoutes.REDIRECT_TO_SP,

    // Disconnect flow
    OidcClientRoutes.DISCONNECT_FROM_IDP,
    OidcClientRoutes.CLIENT_LOGOUT_CALLBACK,

    // Error
    CoreRoutes.REDIRECT_TO_SP_WITH_ERROR,
  ],
  templateExposed: {
    OidcClient: { spId: true, spName: true, idpName: true, idpLabel: true },
  },
  schema: CoreFcpSession,
  defaultData: {
    I18n: {
      language: I18nConfig.defaultLanguage,
    },
  },
} as SessionConfig;
