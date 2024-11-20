/* istanbul ignore file */

// Declarative file
import { I18nTranslationsMapType } from '@fc/i18n';
import { enGB as enGBClaims } from '@fc/scopes';

export const enGB: I18nTranslationsMapType = {
  // claims
  ...enGBClaims,

  // Meta
  'meta.lang': 'en',

  // Errors
  'error.page_title': 'Connection - Error - {platform}',
  'error.support.title': 'What to do?',
  'error.support.button_label': 'Contact us',
  'error.error_title': 'An error occurred',
  'error.error_code': 'Error {code}',
  'error.faq.title': 'Need help ?',
  'error.faq.button_label': 'Please refer to the help page',
  'error.faq.body':
    'For more information on how to use FranceConnect, please visit our help page.',

  'exceptions.default_message': 'Please try again later',
};
