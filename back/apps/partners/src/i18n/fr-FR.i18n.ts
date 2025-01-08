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
};
