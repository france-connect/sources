import { I18nTranslationsMapType } from '@fc/i18n';

export const enGB: I18nTranslationsMapType = {
  'Jwt.exceptions.canNotDecodePlaintext': 'Can not decode plaintext',
  'Jwt.exceptions.canNotDecodeProtectedHeader':
    'Can not decode protected header',
  'Jwt.exceptions.canNotDecrypt': 'Can not decrypt',
  'Jwt.exceptions.canNotEncrypt': 'Can not encrypt',
  'Jwt.exceptions.canNotImportJwk': 'Can not import JWK',
  'Jwt.exceptions.canNotSignJwt': 'Can not sign JWT',
  'Jwt.exceptions.fetchJwksFailed': 'Failed to fetch JWKS',
  'Jwt.exceptions.invalidJwks': 'invalid JWKS format',
  'Jwt.exceptions.invalidSignature': 'Signature not verified',
  'Jwt.exceptions.multipleRelevantKeys': 'Multiple relevant keys found',
  'Jwt.exceptions.noRelevantKey': 'No relevant key found',
};
