/* istanbul ignore file */

// Declarative code
import { PartnersConfig } from '@fc/partners';

import App from './app';
import Logger from './logger';
import Postgres from './postgres';
import Redis from './redis';
import Session from './session';

export default {
  App,
  Logger,
  Postgres,
  Redis,
  Session,
} as PartnersConfig;
