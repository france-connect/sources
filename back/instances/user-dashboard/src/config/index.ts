/* istanbul ignore file */

// Declarative code
import { UserDashboardConfig } from '@fc/user-dashboard';

import App from './app';
import IdentityProviderAdapterEnv from './identity-provider-adapter-env';
import Logger from './logger';
import OidcClient from './oidc-client';
import Redis from './redis';
import Session from './session';
import TracksBroker from './tracks-broker';

export default {
  App,
  IdentityProviderAdapterEnv,
  Logger,
  OidcClient,
  Redis,
  Session,
  TracksBroker,
} as UserDashboardConfig;
