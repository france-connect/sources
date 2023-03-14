/* istanbul ignore file */

// Tested by DTO
import { CoreFcaConfig } from '@fc/core-fca';

import App from './app';
import Core from './core';
import CryptographyFca from './cryptography-fca';
import IdentityProviderAdapterMongo from './identity-provider-adapter-mongo';
import Logger from './logger';
import Mongoose from './mongoose';
import OidcAcr from './oidc-acr';
import OidcClient from './oidc-client';
import OidcProvider from './oidc-provider';
import OverrideOidcProvider from './override-oidc-provider';
import Redis from './redis';
import ServiceProviderAdapterMongo from './service-provider-adapter-mongo';
import Session from './session';
import Tracking from './tracking';

export default {
  App,
  Core,
  Logger,
  OidcAcr,
  OidcProvider,
  OidcClient,
  Mongoose,
  Redis,
  CryptographyFca,
  ServiceProviderAdapterMongo,
  IdentityProviderAdapterMongo,
  Session,
  Tracking,
  OverrideOidcProvider,
} as CoreFcaConfig;
