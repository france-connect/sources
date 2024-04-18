/* istanbul ignore file */

// Tested by DTO
import { CoreFcpHighConfig } from '../dto';
import App from './app';
import Config from './config';
import Core from './core';
import CryptographyBroker from './cryptography-broker';
import CryptographyEidas from './cryptography-eidas';
import CryptographyFcp from './cryptography-fcp';
import DataProviderAdapterMongo from './data-provider-adapter-mongo';
import I18n from './i18n';
import IdentityProviderAdapterMongo from './identity-provider-adapter-mongo';
import Logger from './logger';
import LoggerLegacy from './logger-legacy';
import Mailer from './mailer';
import Mongoose from './mongoose';
import OidcAcr from './oidc-acr';
import OidcClient from './oidc-client';
import OidcProvider from './oidc-provider';
import OverrideOidcProvider from './override-oidc-provider';
import Redis from './redis';
import Rnipp from './rnipp';
import Scopes from './scopes';
import ServiceProviderAdapterMongo from './service-provider-adapter-mongo';
import Session from './session';
import Tracking from './tracking';

export default {
  App,
  Config,
  Core,
  Logger,
  LoggerLegacy,
  OidcAcr,
  OidcProvider,
  OidcClient,
  Mongoose,
  Redis,
  Rnipp,
  CryptographyBroker,
  CryptographyFcp,
  CryptographyEidas,
  Session,
  OverrideOidcProvider,
  Mailer,
  ServiceProviderAdapterMongo,
  IdentityProviderAdapterMongo,
  DataProviderAdapterMongo,
  Scopes,
  Tracking,
  I18n,
} as CoreFcpHighConfig;
