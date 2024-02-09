/* istanbul ignore file */

// Declarative code
import { MockIdentityProviderConfig } from '@fc/mock-identity-provider';

import App from './app';
import Config from './config';
import Logger from './logger';
import OidcAcr from './oidc-acr';
import OidcProvider from './oidc-provider';
import Redis from './redis';
import ServiceProviderAdapterEnv from './service-provider-adapter-env';
import Session from './session';

export default {
  App,
  Config,
  Logger,
  Redis,
  Session,
  OidcAcr,
  OidcProvider,
  ServiceProviderAdapterEnv,
} as MockIdentityProviderConfig;
