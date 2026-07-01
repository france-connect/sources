import { frFR as frAsyncLocalStorage } from '@fc/async-local-storage/i18n';
import { I18nTranslationsMapType } from '@fc/i18n';
import { frFR as frI18n } from '@fc/i18n/i18n';
import { frFR as frJwt } from '@fc/jwt/i18n';
import { frFR as frOidcProvider } from '@fc/oidc-provider/i18n';
import { frFR as frSession } from '@fc/session/i18n';
import { frFR as frViewTemplates } from '@fc/view-templates/i18n';

const ERROR_CONTACT_US =
  'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

const ERROR_RECONNECT =
  'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';

export const frFR: I18nTranslationsMapType = {
  // Keys from used libraries
  ...frAsyncLocalStorage,
  ...frI18n,
  ...frJwt,
  ...frOidcProvider,
  ...frSession,
  ...frViewTemplates,

  // Libraries overrides
  'OidcProvider.exceptions.InvalidRequest.99B1': 'Page non trouvée',
  'OidcProvider.exceptions.InvalidClient.EA6EF':
    'Une erreur de communication avec le fournisseur de service est survenue. Veuillez réessayer ultérieurement.',
  'OidcProvider.exceptions.InvalidRedirectUri.C013C':
    'Une erreur de communication avec le fournisseur de service est survenue. Veuillez réessayer ultérieurement.',

  'CoreFcp.exceptions.coreFcpFailedAbortSession': ERROR_RECONNECT,
  'CoreFcp.exceptions.coreFcpInvalidEventKey': ERROR_CONTACT_US,
  'CoreFcp.exceptions.coreFcpInvalidIdentity':
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
  'CoreFcp.exceptions.coreFcpInvalidRepScope': ERROR_RECONNECT,

  // App specific keys
  'meta.lang': 'fr',

  'common.close': 'Fermer',
  'common.new_window': 'Ouvre une nouvelle fenêtre',

  'footer.a11y_conformity': 'Accessibilité : totalement conforme',
  'footer.legal_notice': 'Mentions légales',
  'footer.more_info': 'En savoir plus',
  'footer.tos': 'CGU',
  'footer.faq': 'Foire aux questions',

  'back_button.text': 'Revenir sur {spName}',
  'nav.more_info': 'En savoir plus',

  'error.page_title': 'Erreur de connexion',
  'error.support.title': 'Que faire ?',
  'error.support.button_label': 'Contacter le support',
  'error.error_title': 'Une erreur s’est produite',
  'error.error_code': 'Erreur {code}',
  'error.faq.title': "Besoin d'aide ?",
  'error.faq.button_label': 'Consulter la page d’aide',
  'error.faq.body': 'Merci de consulter notre page d’aide FranceConnect.',
  'error.faq.y100011.body':
    "Vous avez bloqué l'utilisation de ce fournisseur d'identité. Pour pouvoir l'utiliser à nouveau, merci de consulter notre page d'aide FranceConnect. Dans le cas où vous ne parviendriez pas à débloquer votre accès, veuillez nous contacter et nous transmettre un justificatif d'identité.",

  'exceptions.default_message':
    "Une erreur s'est produite, veuillez réessayer ultérieurement",

  'exceptions.http.404': 'Page non trouvée',
  'loading_modal.redirecting': 'Redirection en cours...',
  'loading_modal.wait': 'veuillez patienter',
};
