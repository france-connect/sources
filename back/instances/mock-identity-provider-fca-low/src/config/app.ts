/* istanbul ignore file */

// Tested by DTO

import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/mock-identity-provider';

import { CustomIdentityDto } from '../dto';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  citizenDatabasePath: env.string('CITIZEN_DATABASE_PATH'),
  csvBooleanColumns: ['is_service_public'],
  scenariosDatabasePath: env.string('SCENARIOS_DATABASE_PATH'),
  httpsOptions: {
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
  },
  name: 'MOCK_IDENTITY_PROVIDER_FCA_LOW',
  urlPrefix: '',
  passwordVerification: env.boolean('PASSWORD_VERIFICATION'),
  assetsPaths: env.json('ASSETS_PATHS'),
  viewsPaths: env.json('VIEWS_PATHS'),
  logo: '/img/logo@3x.svg',
  title: "Fournisseur d'identité de démonstration - FCA-LOW",
  allowCustomIdentity: env.boolean('ALLOW_CUSTOM_IDENTITY'),
  allowBackButton: false,
  identityDto: CustomIdentityDto,
  identityForm: [
    {
      name: 'given_name',
      label: 'Prénoms (séparés par un espace)',
      mandatory: true,
      type: 'text',
    },
    {
      name: 'usual_name',
      label: 'Nom de famille',
      mandatory: true,
      type: 'text',
    },
    {
      name: 'email',
      label: 'Email (Aucun email ne sera envoyé)',
      mandatory: true,
      type: 'text',
    },
    {
      name: 'uid',
      label: 'Identifiant unique (uid)',
      mandatory: true,
      type: 'text',
    },
    {
      name: 'siren',
      label: 'SIREN',
      mandatory: false,
      type: 'text',
    },
    {
      name: 'siret',
      label: 'SIRET',
      mandatory: false,
      type: 'text',
    },
    {
      name: 'organizational_unit',
      label: 'organizational_unit',
      mandatory: false,
      type: 'text',
    },
    {
      name: 'belonging_population',
      label: 'belonging_population',
      mandatory: false,
      type: 'text',
    },
    {
      name: 'phone_number',
      label: 'phone_number',
      mandatory: false,
      type: 'text',
    },
    {
      name: 'chorusdt',
      label: 'chorusdt',
      mandatory: false,
      type: 'text',
    },

    {
      name: 'acr',
      label: 'Niveau de sécurité (acr_values)',
      mandatory: true,
      type: 'text',
    },
  ],
} as AppConfig;
