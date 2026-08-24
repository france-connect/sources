import { ConfigParser } from '@fc/config';
import { EudiDocTypes } from '@fc/eudi';
import { CONFIG_NAMESPACE, MdocConfig } from '@fc/mdoc';

const env = new ConfigParser<typeof CONFIG_NAMESPACE>(process.env, 'Mdoc');

export default {
  docType: EudiDocTypes.PID,
  issuerPrivateKeyPem: env.file('ISSUER_PRIVATE_KEY'),
  issuerCertificatePem: env.file('ISSUER_CERTIFICATE'),
  devicePrivateKeyJwk: env.json('DEVICE_PRIVATE_KEY_JWK'),
  deviceCertificatePem: env.file('DEVICE_CERTIFICATE'),
} as MdocConfig;
