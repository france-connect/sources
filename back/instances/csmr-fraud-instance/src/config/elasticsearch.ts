import { ConfigParser } from '@fc/config';
import { ElasticsearchConfig } from '@fc/elasticsearch';

const env = new ConfigParser(process.env, 'Elasticsearch');

export default {
  index: env.string('FRAUD_INDEX'),
  nodes: env.json('NODES'),
  username: env.string('USERNAME'),
  password: env.string('PASSWORD'),
} as ElasticsearchConfig;
