import { ConfigParser } from '@fc/config';
import { IdpMappings } from '@fc/csmr-fraud';

const env = new ConfigParser(process.env, 'Idp');

/**
 * @TODO #2073
 * Temoprary config for missing idpLabel, to remove in January 2026
 * */
export default {
  mappings: env.json('MAPPINGS'),
} as IdpMappings;
