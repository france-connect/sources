import { ConfigParser } from '@fc/config';
import { EidasLightProtocolConfig } from '@fc/eidas-light-protocol';

const env = new ConfigParser(process.env, 'EidasLightProtocol');

export default {
  lightRequestConnectorSecret: env.string('LIGHT_REQUEST_CONNECTOR_SECRET'),
  lightRequestProxyServiceSecret: env.string(
    'LIGHT_REQUEST_PROXY_SERVICE_SECRET',
  ),
  lightResponseConnectorSecret: env.string('LIGHT_RESPONSE_CONNECTOR_SECRET'),
  lightResponseProxyServiceSecret: env.string(
    'LIGHT_RESPONSE_PROXY_SERVICE_SECRET',
  ),
  maxTokenSize: env.number('MAX_TOKEN_SIZE'),
} as EidasLightProtocolConfig;
