/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { MailerConfig, MailFrom } from '@fc/mailer';

const env = new ConfigParser(process.env, 'Mailer');

const from: MailFrom = {
  email: env.string('FROM_EMAIL'),
  name: env.string('FROM_NAME'),
};
export default {
  templatePaths: env.json('TEMPLATES_PATHS'),
  transport: env.string('TRANSPORT'),
  options: {
    host: env.string('HOST'),
    port: env.number('PORT'),
    secure: env.boolean('SECURE'),
  },
  from,
} as MailerConfig;
