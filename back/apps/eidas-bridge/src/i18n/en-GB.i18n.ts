import { enGB as enApacheIgnite } from '@fc/apache-ignite/i18n';
import { enGB as enAsyncLocalStorage } from '@fc/async-local-storage/i18n';
import { enGB as enCryptography } from '@fc/cryptography/i18n';
import { enGB as enCsv } from '@fc/csv/i18n';
import { enGB as enEidasClient } from '@fc/eidas-client/i18n';
import { enGB as enEidasLightProtocol } from '@fc/eidas-light-protocol/i18n';
import { enGB as enEidasProvider } from '@fc/eidas-provider/i18n';
import { I18nTranslationsMapType } from '@fc/i18n';
import { enGB as enI18n } from '@fc/i18n/i18n';
import { enGB as enOidcClient } from '@fc/oidc-client/i18n';
import { enGB as enOidcProvider } from '@fc/oidc-provider/i18n';
import { enGB as enScopes } from '@fc/scopes';
import { enGB as enSession } from '@fc/session/i18n';
import { enGB as enViewTemplates } from '@fc/view-templates/i18n';

export const enGB: I18nTranslationsMapType = {
  // Keys from used libraries
  ...enApacheIgnite,
  ...enAsyncLocalStorage,
  ...enCryptography,
  ...enCsv,
  ...enEidasClient,
  ...enEidasLightProtocol,
  ...enEidasProvider,
  ...enI18n,
  ...enOidcClient,
  ...enOidcProvider,
  ...enScopes,
  ...enSession,
  ...enViewTemplates,

  // Libraries overrides
  'EidasBridge.exceptions.eidasBridgeInvalidEuIdentity':
    'A problem with your identity data is preventing the connection from succeeding. Please contact us to resolve the issue.',
  'EidasBridge.exceptions.eidasBridgeInvalidFrIdentity':
    'A problem with your identity data is preventing the connection from succeeding. Please contact us to resolve the issue.',

  'OidcProvider.exceptions.InvalidClient.EA6EF': 'Please try again later.',
  'OidcProvider.exceptions.InvalidRedirectUri.C013C': 'Please try again later.',

  // App specific keys
  'meta.lang': 'en',

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
