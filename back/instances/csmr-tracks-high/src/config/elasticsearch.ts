/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { ElasticsearchConfig } from '@fc/elasticsearch';

const env = new ConfigParser(process.env, 'Elasticsearch');

export default {
  tracksIndex: env.string('TRACKS_INDEX'),
  nodes: env.json('NODES'),
  username: env.string('USERNAME'),
  password: env.string('PASSWORD'),
} as ElasticsearchConfig;
