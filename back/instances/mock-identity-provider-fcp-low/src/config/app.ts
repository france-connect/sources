/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/mock-identity-provider';

import { CustomIdentityDto } from '../dto';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  citizenDatabasePath: env.string('CITIZEN_DATABASE_PATH'),
  scenariosDatabasePath: env.string('SCENARIOS_DATABASE_PATH'),
  csvBooleanColumns: [],
  httpsOptions: {
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
  },
  name: process.env.APP_NAME,
  urlPrefix: '',
  passwordVerification: env.boolean('PASSWORD_VERIFICATION'),
  viewsPaths: env.json('VIEWS_PATHS'),
  assetsPaths: env.json('ASSETS_PATHS'),
  logo: '/img/fc-logo.svg',
  title: "Fournisseur d'identité de démonstration - FCP-LOW",
  allowCustomIdentity: env.boolean('ALLOW_CUSTOM_IDENTITY'),
  identityDto: CustomIdentityDto,
  identityForm: [
    {
      name: 'given_name',
      label: 'Prénoms (séparés par un espace)',
      mandatory: true,
      type: 'text',
    },
    {
      name: 'family_name',
      label: 'Nom de famille de naissance',
      mandatory: true,
      type: 'text',
    },
    {
      name: 'preferred_username',
      label: 'Nom de famille d’usage',
      mandatory: false,
      type: 'text',
    },
    {
      name: 'gender',
      label: 'Sexe',
      mandatory: true,
      type: 'select',
      values: [
        { value: 'female', label: 'Femme' },
        { value: 'male', label: 'Homme' },
      ],
    },
    {
      name: 'birthdate',
      label: 'Date de naissance (AAAA-MM-JJ)',
      mandatory: true,
      type: 'text',
    },
    {
      name: 'birthplace',
      label: 'COG Lieu de naissance (Vide si né à l’étranger)',
      mandatory: false,
      type: 'text',
    },
    {
      name: 'birthcountry',
      label: 'COG Pays de naissance (Vide si né en France)',
      mandatory: false,
      type: 'text',
    },
    {
      name: 'email',
      label: 'Email (Aucun email ne sera envoyé)',
      mandatory: true,
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
