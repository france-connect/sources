/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { AppRmqConfig } from '@fc/csmr-fraud';

const env = new ConfigParser(process.env, 'App');

export default {
  name: process.env.APP_NAME,
  environment: env.string('ENVIRONMENT'),
  fraudEmailAddress: env.string('FRAUD_EMAIL_ADDRESS'),
  fraudEmailRecipient: env.string('FRAUD_EMAIL_RECIPIENT'),
  fraudEmailSubject: 'Demande de support - signalement usurpation d’identité',
} as AppRmqConfig;
