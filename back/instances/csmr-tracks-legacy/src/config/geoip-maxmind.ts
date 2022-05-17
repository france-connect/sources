/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { GeoipMaxmindConfig } from '@fc/geoip-maxmind';

const env = new ConfigParser(process.env, 'GeoIpMaxmind');

export default {
  path: env.string('DATABASE_PATH'),
} as GeoipMaxmindConfig;
