/* istanbul ignore file */

// Tested by DTO
import { EidasBridgeConfig } from '@fc/eidas-bridge';

import ApacheIgnite from './apache-ignite';
import App from './app';
import Cog from './cog';
import CryptographyEidas from './cryptography-eidas';
import EidasClient from './eidas-client';
import EidasLightProtocol from './eidas-light-protocol';
import EidasProvider from './eidas-provider';
import IdentityProviderAdapterEnv from './identity-provider-adapter-env';
import Logger from './logger';
import OidcClient from './oidc-client';
import OidcProvider from './oidc-provider';
import OverrideOidcProvider from './override-oidc-provider';
import Redis from './redis';
import ServiceProviderAdapterEnv from './service-provider-adapter-env';
import Session from './session';

export default {
  /**
   * @TODO #253 ETQ Dev, je réfléchis à une manière de gérer des parmètres spécifiques à une app
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/253
   */
  ApacheIgnite,
  App,
  Cog,
  Core: {
    defaultRedirectUri: 'https://franceconnect.gouv.fr',
  },
  CryptographyEidas,
  EidasClient,
  EidasLightProtocol,
  EidasProvider,
  IdentityProviderAdapterEnv,
  Logger,
  OidcClient,
  OidcProvider,
  OverrideOidcProvider,
  Redis,
  ServiceProviderAdapterEnv,
  Session,
} as EidasBridgeConfig;
