import { frFR as frAsyncLocalStorage } from '@fc/async-local-storage/i18n';
import { frFR as frCsrf } from '@fc/csrf/i18n';
import { frFR as frDto2Form } from '@fc/dto2form/i18n';
import { I18nTranslationsMapType } from '@fc/i18n';
import { frFR as frI18n } from '@fc/i18n/i18n';
import { frFR as frOidcClient } from '@fc/oidc-client/i18n';
import { frFR as frSession } from '@fc/session/i18n';
import { frFR as frViewTemplates } from '@fc/view-templates/i18n';

export const frFR: I18nTranslationsMapType = {
  // Keys from used libraries
  ...frAsyncLocalStorage,
  ...frCsrf,
  ...frDto2Form,
  ...frI18n,
  ...frOidcClient,
  ...frSession,
  ...frViewTemplates,

  // form text
  'Form.label.platformSection': '1. Choix de l’environnement',
  'Form.label.spInformationSection':
    '2. Informations sur votre Fournisseur de Service',
  'Form.label.spConfigurationSection':
    '3. Configuration de votre instance de test',
  'Form.label.subSection':
    '4. Gestion des subs pour votre Fournisseur de Service',

  // form create instance label
  'Form.label.name': 'Nom de l’instance',
  'Form.label.client_id': 'Client ID',
  'Form.label.client_secret': 'Client Secret',
  'Form.label.platform': 'Choix de l’environnement',
  'Form.label.signupId': 'Numéro de la demande datapass',
  'Form.label.site': 'URL du site',
  'Form.label.redirect_uris': 'URL de connexion',
  'Form.label.post_logout_redirect_uris': 'URL de déconnexion',
  'Form.label.IPServerAddressesAndRanges': 'Adresse IP',
  'Form.label.id_token_signed_response_alg': 'Algorithme de signature',
  'Form.label.entityId': 'Client ID à réutiliser pour générer les subs',

  // form create instance label description
  'Form.hint.name': 'Renseignez ici le nom de votre instance de test',
  'Form.hint.client_id': '',
  'Form.hint.client_secret': '',
  'Form.hint.platform': '',
  'Form.hint.signupId':
    'Renseignez ici le numéro de la demande Datapass qui a été validée',
  'Form.hint.site':
    'Renseignez ici votre url de site\r\nExemple : https://www.paris.fr/',
  'Form.hint.redirect_uris':
    'Renseignez ici vos urls de callback\r\nExemple : https://www.paris.fr/callback',
  'Form.hint.post_logout_redirect_uris':
    'Renseignez ici vos urls de logout\r\nExemple : https://www.paris.fr/logout',
  'Form.hint.IPServerAddressesAndRanges':
    'Renseignez ici les adresses IP utilisées par votre Fournisseur de Service',
  'Form.hint.id_token_signed_response_alg':
    'Renseignez ici l’algorithme de signature que vous souhaitez utiliser pour la signature des jetons transmis par FranceConnect',
  'Form.hint.entityId':
    'Veuillez saisir le client id de votre fournisseur de service FranceConnect v1',

  // common error field
  // name
  'Form.isFilled_error.name': 'Veuillez saisir le nom de votre instance',
  'Form.isString_error.name': 'Veuillez saisir un nom valide',
  'Form.isLength_error.max.name':
    'Le nom de l’instance doit être de {max} caractères maximum',
  // client_id
  'Form.isString_error.client_id': 'Veuillez saisir votre client id',
  // client_secret
  'Form.isString_error.client_secret': 'Veuillez saisir votre client secret',
  // platform
  'Form.isFilled_error.platform': 'Veuillez saisir votre environnement',
  'Form.isString_error.platform': 'Veuillez saisir votre environnement',
  // signupId
  'Form.isNumeric_error.signupId': 'Veuillez saisir un numéro valide',
  'Form.isLength_error.max.signupId':
    'Le numéro de la demande datapass doit être de {max} caractères maximum',
  // site
  'Form.isFilled_error.site': 'Veuillez saisir votre url de site',
  'Form.isWebsiteURL_error.site': 'Veuillez saisir une url valide',
  'Form.isLength_error.max.site':
    'L’url de site doit être de {max} caractères maximum',
  // redirect_uris
  'Form.isFilled_error.redirect_uris':
    'Veuillez saisir votre url de connexion (url de callback)',
  'Form.isRedirectURL_error.redirect_uris': 'Veuillez saisir une url valide',
  'Form.isLength_error.max.redirect_uris':
    'L’url de connexion doit être de {max} caractères maximum',
  // post_logout_redirect_uris
  'Form.isFilled_error.post_logout_redirect_uris':
    'Veuillez saisir votre url de déconnexion (url de logout)',
  'Form.isRedirectURL_error.post_logout_redirect_uris':
    'Veuillez saisir une url valide',
  'Form.isLength_error.max.post_logout_redirect_uris':
    'L’url de déconnexion doit être de {max} caractères maximum',
  // IPServerAddressesAndRanges
  'Form.isIpAddressesAndRange_error.IPServerAddressesAndRanges':
    'Veuillez saisir une adresse IP valide',
  // id_token_signed_response_alg
  'Form.isFilled_error.id_token_signed_response_alg':
    'Ce champ est obligatoire',
  'Form.isString_error.id_token_signed_response_alg':
    'Veuillez sélectionner votre algorithme de signature',
  'Form.isSignedResponseAlg_error.id_token_signed_response_alg':
    'Les algorithmes de signature autorisés sont les suivants: ES256 et RS256',
  // entityId
  'Form.isLength_error.max.min.entityId':
    'Le client id doit être compris entre {min} et {max} caractères',
  'Form.matches_error.entityId':
    'Veuillez saisir le client id de votre fournisseur de service FranceConnect v1',
};
