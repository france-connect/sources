/* istanbul ignore file */

// Declarative file
import { I18nConfig } from '@fc/i18n';
import { enGB, frFR } from '@fc/scopes/i18n';

export default {
  defaultLanguage: 'fr-FR',
  translations: {
    'fr-FR': frFR,
    'en-GB': enGB,
  },
} as I18nConfig;
