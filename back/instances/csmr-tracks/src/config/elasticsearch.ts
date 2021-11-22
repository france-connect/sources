/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { ElasticsearchConfig } from '@fc/elasticsearch';

const env = new ConfigParser(process.env, 'Elasticsearch');

export default {
  tracksIndex: env.string('TRACKS_INDEX'),
  protocol: env.string('PROTOCOL'),
  host: env.string('HOST'),
  port: env.number('PORT'),
} as ElasticsearchConfig;
