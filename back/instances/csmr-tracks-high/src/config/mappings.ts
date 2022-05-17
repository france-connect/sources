/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';

import { IdpMappings } from '../dto';

const env = new ConfigParser(process.env, 'Idp');

export default {
  mappings: env.json('MAPPINGS'),
} as IdpMappings;
