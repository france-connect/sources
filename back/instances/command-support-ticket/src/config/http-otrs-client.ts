import { ConfigParser } from '@fc/config';
import { HttpOtrsClientConfigDto } from '@fc/http-otrs-client';

const env = new ConfigParser(process.env, 'HttpOtrsClient');

export default {
  baseUrl: env.string('BASE_URL'),
  userLogin: env.string('LOGIN'),
  password: env.string('PASSWORD'),
} as HttpOtrsClientConfigDto;
