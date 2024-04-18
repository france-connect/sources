/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { OidcClientRoutes } from '@fc/oidc-client';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';
import {
  UserDashboardBackRoutes,
  UserDashboardSession,
} from '@fc/user-dashboard';

import I18nConfig from './i18n';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'strict',
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
  middlewareExcludedRoutes: [],
  middlewareIncludedRoutes: [
    // Connection flow
    OidcClientRoutes.REDIRECT_TO_IDP,
    OidcClientRoutes.OIDC_CALLBACK,
    UserDashboardBackRoutes.LOGIN,
    UserDashboardBackRoutes.LOGIN_CALLBACK,

    // Business
    UserDashboardBackRoutes.ERROR,
    UserDashboardBackRoutes.USER_PREFERENCES,
    UserDashboardBackRoutes.TRACKS,
    UserDashboardBackRoutes.USER_INFOS,
    UserDashboardBackRoutes.VERIFY,
    UserDashboardBackRoutes.CSRF_TOKEN,

    // Disconnection flow
    UserDashboardBackRoutes.LOGOUT,
    UserDashboardBackRoutes.LOGOUT_CALLBACK,
    UserDashboardBackRoutes.REVOCATION,
    UserDashboardBackRoutes.OIDC_CLIENT_GET_END_SESSION_URL,
  ],
  schema: UserDashboardSession,
  defaultData: {
    I18n: {
      language: I18nConfig.defaultLanguage,
    },
  },
} as SessionConfig;
