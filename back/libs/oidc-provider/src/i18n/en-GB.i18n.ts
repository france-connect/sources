import { I18nTranslationsMapType } from '@fc/i18n';
import { enGB as runtime } from '@fc/oidc-provider/exceptions/runtime/en-GB.i18n';

const ERROR_CONTACT_US =
  'A technical error has occurred. If the problem persists, please contact us.';

const ERROR_RECONNECT =
  'A technical error has occurred. Please close your browser tab and reconnect.';

const ERROR_RETRY_LATER =
  'A technical error has occurred. Please reconnect later.';

export const enGB: I18nTranslationsMapType = {
  ...runtime,
  // oidc-provider
  'OidcProvider.exceptions.oidcProviderAuthorizeParams':
    'A technical incident is currently affecting the service that initiated the authentication request via FranceConnect. We will reach out to their teams to resolve this incident. Please reconnect later.',
  'OidcProvider.exceptions.oidcProviderBinding': ERROR_RETRY_LATER,
  'OidcProvider.exceptions.oidcProviderGrantSave': ERROR_CONTACT_US,
  'OidcProvider.exceptions.oidcProviderInitialisation': ERROR_RETRY_LATER,
  'OidcProvider.exceptions.oidcProviderInteractionNoFound': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderParseJsonClaims': ERROR_RETRY_LATER,
  'OidcProvider.exceptions.oidcProviderParseRedisResponse': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderSpidNotFound': ERROR_RETRY_LATER,
  'OidcProvider.exceptions.oidcProviderStringifyPayloadForRedis':
    ERROR_RETRY_LATER,
  'OidcProvider.exceptions.RuntimeException': ERROR_RECONNECT,
};
