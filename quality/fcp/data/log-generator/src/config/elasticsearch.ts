/* istanbul ignore file */

// Declarative code
const ELASTICSEARCH_URL =
  'https://docker-stack:docker-stack@elasticsearch:9200';

export const ElasticSearchConfig = {
  coreV2Index: 'fc_tracks',
  legacyIndex: 'franceconnect',
  nodes: `["${ELASTICSEARCH_URL}"]`,
  password: 'docker-stack',
  url: ELASTICSEARCH_URL,
  username: 'docker-stack',
};
