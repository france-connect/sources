import { frFR as frAccount } from '@fc/account/i18n';
import { frFR as frAsyncLocalStorage } from '@fc/async-local-storage/i18n';
import { frFR as frCore } from '@fc/core/i18n';
import { frFR as frCryptography } from '@fc/cryptography/i18n';
import { frFR as frCsrf } from '@fc/csrf/i18n';
import { frFR as frDataProviderAdapterMongo } from '@fc/data-provider-adapter-mongo/i18n';
import { frFR as frDevice } from '@fc/device/i18n';
import { frFR as frFeatureHandler } from '@fc/feature-handler/i18n';
import { frFR as frFlowSteps } from '@fc/flow-steps/i18n';
import { I18nTranslationsMapType } from '@fc/i18n';
import { frFR as frI18n } from '@fc/i18n/i18n';
import { frFR as frJwt } from '@fc/jwt/i18n';
import { frFR as frMailer } from '@fc/mailer/i18n';
import { frFR as frOidcAcr } from '@fc/oidc-acr/i18n';
import { frFR as frOidcClient } from '@fc/oidc-client/i18n';
import { frFR as frOidcProvider } from '@fc/oidc-provider/i18n';
import { frFR as frOverrideOidcProvider } from '@fc/override-oidc-provider/i18n';
import { frFR as frRnipp } from '@fc/rnipp/i18n';
import { frFR as frScopes } from '@fc/scopes/i18n';
import { frFR as frSession } from '@fc/session/i18n';
import { frFR as frTrackingContext } from '@fc/tracking-context/i18n';
import { frFR as frViewTemplates } from '@fc/view-templates/i18n';

const ERROR_CONTACT_US =
  'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

const ERROR_RECONNECT =
  'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';

export const frFR: I18nTranslationsMapType = {
  // Keys from used libraries
  ...frAccount,
  ...frAsyncLocalStorage,
  ...frCore,
  ...frCryptography,
  ...frCsrf,
  ...frDataProviderAdapterMongo,
  ...frDevice,
  ...frFeatureHandler,
  ...frFlowSteps,
  ...frI18n,
  ...frJwt,
  ...frMailer,
  ...frOidcAcr,
  ...frOidcClient,
  ...frOidcProvider,
  ...frOverrideOidcProvider,
  ...frRnipp,
  ...frScopes,
  ...frSession,
  ...frTrackingContext,
  ...frViewTemplates,

  // Libraries overrides
  'OidcProvider.exceptions.InvalidRequest.99B1': 'Page non trouvée',
  'OidcProvider.exceptions.InvalidClient.EA6E':
    'Une erreur de communication avec le fournisseur de service est survenue. Veuillez réessayer ultérieurement.',
  'OidcProvider.exceptions.InvalidRedirectUri.C013':
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

  'footer.a11y_conformity': 'Accessibilité : non conforme',
  'footer.more_info': 'En savoir plus sur {platform}',
  'footer.tos': 'CGU',
  'footer.faq': 'Foire aux questions',

  'nav.back_to_provider': 'Revenir sur {spName}',
  'nav.more_info': 'En savoir plus',

  'interaction.page_title': 'Connexion - Choix du compte - {platform}',
  'interaction.anonymous_no_personal_data':
    'Vous allez continuer de façon anonyme, aucune donnée personnelle ne sera transmise',
  'interaction.idp_connexion_failed':
    'La connexion à <b>{idpName}</b> n’a pas été possible. Veuillez réessayer ou choisir un autre moyen de connexion.',
  'interaction.beta_provider': 'BETA',

  'interaction.connecting_to': 'Connexion en cours sur {spName}',
  'interaction.choose_provider': 'Choisissez un compte pour vous connecter :',
  'interaction.modal.cancel_text': 'Utiliser un autre compte',

  'consent.page_title':
    'Connexion - Continuer sur Service {spName} - {platform}',
  'consent.login_as': 'Vous allez vous connecter en tant que :',
  'consent.login_anonymously': 'Vous allez vous connecter de façon anonyme',
  'consent.continue_to_sp': 'Continuer sur {spName}',
  'consent.data_transfer_consent':
    'J’accepte que {platform} transmette mes données au service pour me connecter',
  'consent.consent_checkbox':
    'Veuillez cocher la case pour accepter le transfert des données',
  'consent.transmitted_data': 'Données transmises',
  'consent.data_fetched_from': 'Informations récupérées depuis {dpName}',
  'consent.no_personal_data_transmitted':
    'Aucune donnée personnelle ne sera transmise',
  'consent.information_block_title': 'Les notifications de connexion évoluent',
  'consent.information_block_content':
    'FranceConnect ne vous enverra plus systématiquement une notification à chacune de vos connexions. Une notification vous sera envoyée uniquement lorsqu’une connexion inhabituelle est détectée.',

  'error.page_title': 'Connexion - Erreur - {platform}',
  'error.support.title': 'Que faire ?',
  'error.support.button_label': 'Contactez-nous',
  'error.error_title': 'Une erreur s’est produite',
  'error.error_code': 'Erreur {code}',
  'error.faq.title': "Besoin d'aide ?",
  'error.faq.button_label': 'Consulter la page d’aide',
  'error.faq.body': 'Merci de consulter notre page d’aide FranceConnect.',

  'exceptions.default_message':
    "Une erreur s'est produite, veuillez réessayer ultérieurement",

  'exceptions.http.404': 'Page non trouvée',
};
