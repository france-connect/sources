import { CommandElasticConfig } from '@fc/command-elastic';

import App from './app';
import ElasticControl from './elastic-control';
import Elasticsearch from './elasticsearch';
import Logger from './logger';

export default {
  App,
  Logger,
  Elasticsearch,
  ElasticControl,
} as CommandElasticConfig;
