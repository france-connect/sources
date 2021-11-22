/* istanbul ignore file */

// Declarative code
import { MockIdentityProviderConfig } from '@fc/mock-identity-provider';

import App from './app';
import Logger from './logger';
import OidcProvider from './oidc-provider';
import Redis from './redis';
import ServiceProviderAdapterEnv from './service-provider-adapter-env';
import Session from './session';

export default {
  App,
  Logger,
  Redis,
  Session,
  OidcProvider,
  ServiceProviderAdapterEnv,
} as MockIdentityProviderConfig;
