/* istanbul ignore file */

// Tested by DTO
import { CoreFcaConfig } from '@fc/core-fca';

import App from './app';
import CryptographyFca from './cryptography-fca';
import IdentityProviderAdapterMongo from './identity-provider-adapter-mongo';
import Logger from './logger';
import Mongoose from './mongoose';
import OidcClient from './oidc-client';
import OidcProvider from './oidc-provider';
import OverrideOidcProvider from './override-oidc-provider';
import Redis from './redis';
import ServiceProviderAdapterMongo from './service-provider-adapter-mongo';
import Session from './session';

export default {
  /**
   * @TODO #253 ETQ Dev, je réfléchis à une manière de gérer des parmètres spécifiques à une app
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/253
   */
  Core: {
    defaultRedirectUri: 'https://franceconnect.gouv.fr',
  },
  App,
  Logger,
  OidcProvider,
  OidcClient,
  Mongoose,
  Redis,
  CryptographyFca,
  ServiceProviderAdapterMongo,
  IdentityProviderAdapterMongo,
  Session,
  OverrideOidcProvider,
} as CoreFcaConfig;
