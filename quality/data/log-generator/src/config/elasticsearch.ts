/* istanbul ignore file */

// Declarative code
const { DOCKER_SERVICE_IP } = process.env;

const ELASTICSEARCH_HOST = DOCKER_SERVICE_IP || 'elasticsearch';
const ELASTICSEARCH_URL = `https://docker-stack:docker-stack@${ELASTICSEARCH_HOST}:9200`;

export const ElasticSearchConfig = {
  coreV2Index: 'fc_tracks',
  legacyIndex: 'franceconnect',
  nodes: `["${ELASTICSEARCH_URL}"]`,
  password: 'docker-stack',
  url: ELASTICSEARCH_URL,
  username: 'docker-stack',
};
