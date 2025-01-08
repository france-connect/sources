import { I18nTranslationsMapType } from '@fc/i18n';

export const enGB: I18nTranslationsMapType = {
  'ViewTemplates.exceptions.viewTemplateConflictingAlias':
    'A template operator alias with this name is already registered. Error during application startup.',
  'ViewTemplates.exceptions.viewTemplateServiceNotFound':
    'An alias on an instance method could not be exposed to the templates, probably because the service is not registered as a provider.',
};
