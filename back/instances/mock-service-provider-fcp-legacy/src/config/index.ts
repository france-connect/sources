/* istanbul ignore file */

// Declarative code
import { MockServiceProviderConfig } from '@fc/mock-service-provider';

import App from './app';
import IdentityProviderAdapterEnv from './identity-provider-adapter-env';
import Logger from './logger';
import OidcAcr from './oidc-acr';
import OidcClient from './oidc-client';
import Redis from './redis';
import Session from './session';

export default {
  App,
  Logger,
  Redis,
  OidcAcr,
  OidcClient,
  IdentityProviderAdapterEnv,
  Session,
} as MockServiceProviderConfig;
