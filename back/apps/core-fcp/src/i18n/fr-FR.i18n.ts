/* istanbul ignore file */

// Declarative file
import { I18nTranslationsMapType } from '@fc/i18n';
import { frFR as frFRClaims } from '@fc/scopes';

export const frFR: I18nTranslationsMapType = {
  // claims
  ...frFRClaims,

  // Meta
  'meta.lang': 'fr',

  // Common
  'common.close': 'Fermer',
  'common.new_window': 'Ouvre une nouvelle fenêtre',

  // Footer
  'footer.a11y_conformity': 'Accessibilité : non conforme',
  'footer.more_info': 'En savoir plus sur {platform}',
  'footer.tos': 'CGU',
  'footer.faq': 'Foire aux questions',

  // Navigation
  'nav.back_to_provider': 'Revenir sur {spName}',
  'nav.more_info': 'En savoir plus',

  // Interaction
  'interaction.page_title': 'Connexion - Choix du compte - {platform}',
  'interaction.anonymous_no_personal_data':
    'Vous allez continuer de façon anonyme, aucune donnée personnelle ne sera transmise',
  'interaction.idp_connexion_failed':
    'La connexion à <b>{idpName}</b> n’a pas été possible. Veuillez réessayer ou choisir un autre moyen de connexion.',
  'interaction.beta_provider': 'BETA',

  'interaction.connecting_to': 'Connexion en cours sur {spName}',
  'interaction.choose_provider': 'Choisissez un compte pour vous connecter :',
  'interaction.modal.cancel_text': 'Utiliser un autre compte',

  // Consent
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

  // Errors
  'error.page_title': 'Connexion - Erreur - {platform}',
  'error.what_to_do': 'Que faire ?',
  'error.contact_us': 'Contactez-nous',
  'error.an_error_occurred': 'Une erreur s’est produite',
  'error.error_code': 'Erreur {code}',
};
