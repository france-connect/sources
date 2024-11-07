/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { MailerConfig } from '@fc/mailer';

const env = new ConfigParser(process.env, 'Mailer');

export default {
  templatePaths: env.json('TEMPLATES_PATHS'),
  transport: env.string('TRANSPORT'),
  options: {
    host: env.string('HOST'),
    port: env.number('PORT'),
    secure: env.boolean('SECURE'),
    rejectUnauthorized: env.boolean('REJECT_UNAUTHORIZED'),
  },
} as MailerConfig;
