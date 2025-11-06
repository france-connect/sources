import { ConfigParser } from '@fc/config';
import { AppRmqConfig } from '@fc/csmr-fraud';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'CSMR-FRAUD',
  environment: env.string('ENVIRONMENT'),
  fraudEmailAddress: env.string('FRAUD_EMAIL_ADDRESS'),
  fraudEmailRecipient: env.string('FRAUD_EMAIL_RECIPIENT'),
  fraudEmailSubject: 'Demande de support - signalement usurpation d’identité',
} as AppRmqConfig;
