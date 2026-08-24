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
  'common.new_window': 'Nouvelle fenêtre',

  'footer.a11y_conformity': 'Accessibilité : totalement conforme',
  'footer.legal_notice': 'Mentions légales',
  'footer.more_info': 'En savoir plus',
  'footer.tos': 'CGU',
  'footer.faq': 'Foire aux questions',

  'skiplinks.quick_access': 'Accès rapide',
  'skiplinks.content': 'Contenu',
  'skiplinks.footer': 'Pied de page',

  'back_button.text': 'Revenir sur {spName}',
  'nav.more_info': 'En savoir plus',

  'interaction.page_title':
    'Connexion avec le portefeuille d’identité numérique - FranceConnect',
  'interaction.title': 'S’identifier avec le portefeuille d’identité numérique',
  'interaction.open_app':
    'Ouvrir l’application portefeuille d’identité numérique',
  'interaction.scan_instructions':
    'Scanner ce QR Code avec votre application pour confirmer votre identité',
  'interaction.scan_fallback_mobile':
    'Si l’application n’est pas installée sur cet appareil, scanner ce QR code pour vous connecter.',
  'interaction.qr_code_alt':
    'QR Code de connexion, à scanner avec votre application portefeuille d’identité numérique',
  'interaction.how_to.title': 'Comment scanner ce QR Code ?',
  'interaction.how_to.step1':
    'Ouvrez votre application portefeuille d’identité numérique sur votre téléphone.',
  'interaction.how_to.step2': 'Appuyez sur Scanner un QR code.',
  'interaction.how_to.step3':
    'Placez le QR Code ci-contre face à votre caméra.',
  'interaction.about.title':
    'Qu’est-ce qu’un portefeuille d’identité numérique ?',
  'interaction.about.body':
    'Le portefeuille d’identité est une application sécurisée qui vous permet de prouver votre identité et de partager des informations vérifiées de manière sécurisée.',
  'interaction.about.link_label': 'En savoir plus',
  'interaction.status.pending': 'Authentification en cours',
  'interaction.status.success': 'Authentification réussie',
  'interaction.status.success_redirect':
    'Vous allez être redirigé vers le service.',
  'interaction.status.error': 'Échec de connexion',
  'interaction.status.error_retry':
    'Veuillez réessayer ou choisir un autre moyen de connexion.',

  'error.page_title': 'Erreur de connexion',
  'error.support.title': 'Que faire ?',
  'error.support.button_label': 'Contacter le support',
  'error.error_title': 'Une erreur s’est produite',
  'error.error_code': 'Erreur {code}',
  'error.faq.title': "Besoin d'aide ?",
  'error.faq.button_label': 'Consulter la page d’aide',
  'error.faq.body': 'Merci de consulter notre page d’aide FranceConnect.',
  'error.faq.y100011.body':
    'Vous avez bloqué l’utilisation de ce fournisseur d’identité. Pour pouvoir l’utiliser à nouveau, merci de consulter notre page d’aide FranceConnect. Dans le cas où vous ne parviendriez pas à débloquer votre accès, veuillez nous contacter et nous transmettre un justificatif d’identité.',

  'exceptions.default_message':
    'Une erreur s’est produite, veuillez réessayer ultérieurement',

  'exceptions.http.404': 'Page non trouvée',
  'loading_modal.redirecting': 'Redirection en cours...',
  'loading_modal.wait': 'veuillez patienter',
};
