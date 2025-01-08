import { I18nTranslationsMapType } from '@fc/i18n';
import { enGB as runtime } from '@fc/oidc-provider/exceptions/runtime/en-GB.i18n';

const ERROR_CONTACT_US =
  'A technical error has occurred. If the problem persists, please contact us.';

const ERROR_RECONNECT =
  'A technical error has occurred. Please close your browser tab and reconnect.';

export const enGB: I18nTranslationsMapType = {
  ...runtime,
  // oidc-provider
  'OidcProvider.exceptions.oidcProviderAuthorizeParams': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderBinding': ERROR_CONTACT_US,
  'OidcProvider.exceptions.oidcProviderGrantSave': ERROR_CONTACT_US,
  'OidcProvider.exceptions.oidcProviderInitialisation': ERROR_CONTACT_US,
  'OidcProvider.exceptions.oidcProviderInteractionNoFound': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderParseJsonClaims': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderParseRedisResponse': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderSpidNotFound': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderStringifyPayloadForRedis':
    ERROR_CONTACT_US,
  'OidcProvider.exceptions.RuntimeException': ERROR_RECONNECT,
};
