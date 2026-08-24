import { COG_CITY, COG_COUNTRY, COG_ISO_COUNTRY, CogConfig } from '@fc/cog';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'Cog');

export default {
  [COG_CITY]: env.string('CITY_FILE'),
  [COG_COUNTRY]: env.string('COUNTRY_FILE'),
  [COG_ISO_COUNTRY]: env.string('ISO_COUNTRY_FILE'),
} as CogConfig;
