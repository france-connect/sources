/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { RnippConfig } from '@fc/rnipp';

const env = new ConfigParser(process.env, 'Rnipp');

export default {
  protocol: env.string('PROTOCOL'),
  hostname: env.string('HOSTNAME'),
  baseUrl: env.string('BASEURL'),

  // Global request timeout used for any outgoing app requests.
  timeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
} as RnippConfig;
