import { I18nTranslationsMapType } from '@fc/i18n';

export const frFR: I18nTranslationsMapType = {
  'Jwt.exceptions.canNotDecodePlaintext': 'Impossible de décoder le texte brut',
  'Jwt.exceptions.canNotDecodeProtectedHeader':
    'Impossible de décoder l’en-tête protégé',
  'Jwt.exceptions.canNotDecrypt': 'Impossible de déchiffrer',
  'Jwt.exceptions.canNotEncrypt': 'Impossible de chiffrer',
  'Jwt.exceptions.canNotImportJwk': 'Impossible d’importer la JWK',
  'Jwt.exceptions.canNotSignJwt': 'Impossible de signer le JWT',
  'Jwt.exceptions.fetchJwksFailed': 'Échec de la récupération du JWKS',
  'Jwt.exceptions.invalidJwks': 'Format de la JWKS invalide',
  'Jwt.exceptions.invalidSignature': 'Signature non vérifiée',
  'Jwt.exceptions.multipleRelevantKeys': 'Plusieurs clés pertinentes trouvées',
  'Jwt.exceptions.noRelevantKey': 'Aucune clé pertinente trouvée',
};
