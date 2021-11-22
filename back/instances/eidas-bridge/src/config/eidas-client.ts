import { ConfigParser } from '@fc/config';
import { EidasClientConfig } from '@fc/eidas-client';

const env = new ConfigParser(process.env, 'EidasClient');

export default {
  connectorRequestIssuer: env.string('CONNECTOR_REQUEST_ISSUER'),
  connectorRequestCache: env.string('CONNECTOR_REQUEST_CACHE'),
  connectorRequestCacheUrl: env.string('CONNECTOR_REQUEST_URL'),
  connectorResponseCache: env.string('CONNECTOR_RESPONSE_CACHE'),
  redirectAfterResponseHandlingUrl: env.string(
    'REDIRECT_AFTER_RESPONSE_HANDLING_URL',
  ),
} as EidasClientConfig;
