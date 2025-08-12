import { frFR as frAsyncLocalStorage } from '@fc/async-local-storage/i18n';
import { frFR as frCsrf } from '@fc/csrf/i18n';
import { frFR as frFraudIdentityTheft } from '@fc/fraud-identity-theft/i18n';
import { frFR as frI18n } from '@fc/i18n/i18n';
import { frFR as frMailer } from '@fc/mailer/i18n';
import { frFR as frOidcClient } from '@fc/oidc-client/i18n';
import { frFR as frScopes } from '@fc/scopes/i18n';
import { frFR as frSession } from '@fc/session/i18n';
import { frFR as frUserPreferences } from '@fc/user-preferences/i18n';

export const frFR = {
  ...frAsyncLocalStorage,
  ...frCsrf,
  ...frI18n,
  ...frMailer,
  ...frOidcClient,
  ...frSession,
  ...frScopes,
  ...frUserPreferences,
  ...frFraudIdentityTheft,
};
