import { I18nTranslationsMapType } from '@fc/i18n';
import { frFR as runtime } from '@fc/oidc-provider/exceptions/runtime/fr-FR.i18n';

const ERROR_CONTACT_US =
  'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

const ERROR_RECONNECT =
  'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';

const ERROR_RETRY_LATER =
  'Une erreur technique est survenue. Veuillez vous reconnecter ultérieurement.';

export const frFR: I18nTranslationsMapType = {
  ...runtime,
  // oidc-provider
  'OidcProvider.exceptions.OidcProviderUserAborted': ERROR_RECONNECT,
  'OidcProvider.exceptions.oidcProviderAuthorizeParams':
    'Un incident technique est en cours sur le service à l’origine de la demande d’authentification via FranceConnect. Nous allons nous rapprocher de leurs équipes pour résoudre cet incident. Veuillez vous reconnecter ultérieurement.',
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

  'OidcProvider.exceptions.InvalidClient.A586':
    'Une erreur de communication avec le fournisseur de service est survenue. Veuillez réessayer ultérieurement.',
  'OidcProvider.exceptions.InvalidRedirectUri.6350':
    'Une erreur de communication avec le fournisseur de service est survenue. Veuillez réessayer ultérieurement.',
  'OidcProvider.exceptions.InvalidClientMetadata.A8220':
    'Une erreur de communication avec le fournisseur de service est survenue : Impossible de contacter le "sector_identifier_uri".',
};
