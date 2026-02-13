import { ConfigParser } from '@fc/config';
import { ElasticControlConfig } from '@fc/elasticsearch';

const env = new ConfigParser(process.env, 'ElasticControl');

export default {
  metricsIndex: env.string('METRICS_INDEX'),
  controlIndex: env.string('CONTROL_INDEX'),
  lowTracksIndex: env.string('LOW_TRACKS_INDEX'),
  highTracksIndex: env.string('HIGH_TRACKS_INDEX'),
} as ElasticControlConfig;
