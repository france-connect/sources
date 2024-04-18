/* istanbul ignore file */

// Declarative file
import { enGB, frFR } from '@fc/core-fcp/i18n';
import { I18nConfig } from '@fc/i18n';

import { enGB as instanceEN, frFR as instanceFR } from '../i18n';

export default {
  defaultLanguage: 'fr-FR',
  translations: {
    'fr-FR': { ...frFR, ...instanceFR },
    'en-GB': { ...enGB, ...instanceEN },
  },
} as I18nConfig;
