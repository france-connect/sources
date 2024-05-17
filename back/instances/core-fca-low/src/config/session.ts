/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { CoreRoutes } from '@fc/core';
import { CoreFcaSession } from '@fc/core-fca';
import { CoreFcaRoutes } from '@fc/core-fca/enums/core-fca-routes.enum';
import { OidcClientRoutes } from '@fc/oidc-client';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  maxAge: 43200000, // 12h
  domain: process.env.FQDN,
};

export default {
  encryptionKey: env.string('USERINFO_CRYPT_KEY'),
  prefix: 'FCA-LOW-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'fc_session_id',
  lifetime: 43200, // 12h
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
    CoreRoutes.INTERACTION_LOGIN,
    OidcProviderRoutes.REDIRECT_TO_SP,
    CoreFcaRoutes.INTERACTION_IDENTITY_PROVIDER_SELECTION,

    // Disconnect flow
    OidcClientRoutes.DISCONNECT_FROM_IDP,
    OidcClientRoutes.CLIENT_LOGOUT_CALLBACK,

    // Error
    CoreRoutes.REDIRECT_TO_SP_WITH_ERROR,
  ],
  templateExposed: {
    OidcClient: { spName: true, idpName: true },
  },
  schema: CoreFcaSession,
  defaultData: {},
} as SessionConfig;
