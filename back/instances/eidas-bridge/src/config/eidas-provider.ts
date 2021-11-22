import { ConfigParser } from '@fc/config';
import { EidasProviderConfig } from '@fc/eidas-provider';

const env = new ConfigParser(process.env, 'EidasProvider');

export default {
  proxyServiceResponseIssuer: env.string('PROXY_SERVICE_RESPONSE_ISSUER'),
  proxyServiceResponseCache: env.string('PROXY_SERVICE_RESPONSE_CACHE'),
  proxyServiceResponseCacheUrl: env.string('PROXY_SERVICE_RESPONSE_URL'),
  proxyServiceRequestCache: env.string('PROXY_SERVICE_REQUEST_CACHE'),
  redirectAfterRequestHandlingUrl: env.string(
    'REDIRECT_AFTER_REQUEST_HANDLING_URL',
  ),
} as EidasProviderConfig;
