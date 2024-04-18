/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { EidasBridgeRoutes, EidasBridgeSession } from '@fc/eidas-bridge';
import { EidasClientRoutes } from '@fc/eidas-client';
import { EidasProviderRoutes } from '@fc/eidas-provider';
import { OidcClientRoutes } from '@fc/oidc-client';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { ISessionCookieOptions, SessionConfig } from '@fc/session';

const env = new ConfigParser(process.env, 'Session');

const cookieOptions: ISessionCookieOptions = {
  signed: true,
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  maxAge: 600000, // 10 minutes
  domain: process.env.FQDN,
};

export default {
  encryptionKey: env.string('USERINFO_CRYPT_KEY'),
  prefix: 'EIDAS-BRIDGE-SESS:',
  cookieOptions,
  cookieSecrets: env.json('COOKIE_SECRETS'),
  sessionCookieName: 'eidas_session_id',
  lifetime: 600, // 10 minutes
  sessionIdLength: 64,
  slidingExpiration: false,
  middlewareExcludedRoutes: [],
  middlewareIncludedRoutes: [
    // Connect flow
    OidcProviderRoutes.AUTHORIZATION,
    OidcClientRoutes.REDIRECT_TO_IDP,
    OidcClientRoutes.OIDC_CALLBACK,
    OidcProviderRoutes.REDIRECT_TO_SP,

    `${EidasBridgeRoutes.BASE}${EidasBridgeRoutes.INIT_SESSION}`,
    `${EidasBridgeRoutes.BASE}${EidasBridgeRoutes.REDIRECT_TO_FC_AUTHORIZE}`,
    EidasBridgeRoutes.INTERACTION_LOGIN,
    `${EidasBridgeRoutes.BASE}${EidasBridgeRoutes.REDIRECT_TO_EIDAS_RESPONSE_PROXY}`,

    EidasBridgeRoutes.INTERACTION,
    EidasBridgeRoutes.FINISH_FC_INTERACTION,

    `${EidasProviderRoutes.BASE}${EidasProviderRoutes.REQUEST_HANDLER}`,
    `${EidasProviderRoutes.BASE}${EidasProviderRoutes.RESPONSE_PROXY}`,

    `${EidasClientRoutes.BASE}${EidasClientRoutes.REDIRECT_TO_FR_NODE_CONNECTOR}`,
    `${EidasClientRoutes.BASE}${EidasClientRoutes.RESPONSE_HANDLER}`,

    // Disconnect flow
    OidcProviderRoutes.END_SESSION,
    OidcClientRoutes.DISCONNECT_FROM_IDP,
    OidcClientRoutes.CLIENT_LOGOUT_CALLBACK,
  ],
  schema: EidasBridgeSession,
  defaultData: {},
} as SessionConfig;
