/* istanbul ignore file */

// Declarative code
import { PartnersConfig } from '@fc/partners';

import App from './app';
import I18n from './i18n';
import IdentityProviderAdapterEnv from './identity-provider-adapter-env';
import Logger from './logger';
import OidcAcr from './oidc-acr';
import OidcClient from './oidc-client';
import Redis from './redis';
import Session from './session';

export default {
  App,
  IdentityProviderAdapterEnv,
  Logger,
  OidcAcr,
  OidcClient,
  Redis,
  Session,
  I18n,
} as PartnersConfig;
