import { WalletBridgeConfig } from '@fc/wallet-bridge';

import App from './app';
import Cog from './cog';
import Config from './config';
import Exceptions from './exceptions';
import I18n from './i18n';
import Logger from './logger';
import LoggerLegacy from './logger-legacy';
import OidcAcr from './oidc-acr';
import OidcProvider from './oidc-provider';
import Openid4vp from './openid4vp';
import Redis from './redis';
import ServiceProviderAdapterEnv from './service-provider-adapter-env';
import Session from './session';

export default {
  App,
  Cog,
  Config,
  Exceptions,
  Logger,
  Redis,
  Session,
  I18n,
  Openid4vp,
  LoggerLegacy,
  OidcAcr,
  OidcProvider,
  ServiceProviderAdapterEnv,
} as WalletBridgeConfig;
