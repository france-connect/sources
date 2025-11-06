import { PartnersConfig } from '@fc/partners';

import App from './app';
import ConfigSandboxLowMicroService from './config-sandbox-low-microservice';
import DefaultServiceProviderLowValue from './default-service-provider-low-value';
import Exceptions from './exceptions';
import I18n from './i18n';
import IdentityProviderAdapterEnv from './identity-provider-adapter-env';
import Logger from './logger';
import OidcAcr from './oidc-acr';
import OidcClient from './oidc-client';
import Postgres from './postgres';
import Redis from './redis';
import Session from './session';
import WebhooksDatapass from './webhooks-datapass';
import WebhooksInvitation from './webhooks-invitation';

export default {
  App,
  Exceptions,
  IdentityProviderAdapterEnv,
  Logger,
  OidcAcr,
  OidcClient,
  Postgres,
  Redis,
  Session,
  I18n,
  ConfigSandboxLowMicroService,
  DefaultServiceProviderLowValue,
  WebhooksDatapass,
  WebhooksInvitation,
} as PartnersConfig;
