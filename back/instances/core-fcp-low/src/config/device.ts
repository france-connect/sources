/* istanbul ignore file */

// Declarative file
import { ConfigParser } from '@fc/config';
import { DeviceConfig } from '@fc/device';

const env = new ConfigParser(process.env, 'Device');

export default {
  identityHmacSecret: env.json('IDENTITY_HMAC_SECRET'),
  identityHmacDailyTtl: env.number('IDENTITY_HMAC_DAILY_TTL'),
  cookieName: env.string('COOKIE_NAME'),
  cookieDomain: env.string('COOKIE_DOMAIN'),
  maxIdentityNumber: env.number('MAX_IDENTITY_NUMBER'),
  maxIdentityTrusted: env.number('MAX_IDENTITY_TRUSTED'),
  identityHashSourceProperties: [
    'given_name',
    'family_name',
    'birthdate',
    'gender',
    'birthplace',
    'birthcountry',
  ],
  headerFlags: [
    {
      name: 'x-suspicious',
      positiveValue: '1',
    },
  ],
} as DeviceConfig;
