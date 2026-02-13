import {
  ElasticsearchFilterInterface,
  ElasticsearchResponseInterface,
} from '../types';

const LOG_DATA_TYPE = 'traces';

const LEGACY_PLATFORM = 'FranceConnect(CL)';
const serviceNameMapping = {
  'FranceConnect(CL)': 'fc_core_app',
  'FranceConnect(v2)': 'fc_core_low_app',
  'FranceConnect+': 'fc_core_v2_app',
};

const LEGACY_LOG_INDEX = 'franceconnect';
const indexMapping = {
  métriques: 'metrics',
  traces: 'fc_tracks',
  événements: 'events',
};

const getIndex = (dataType: string, platform: string): string => {
  let index = indexMapping[dataType];
  if (dataType === LOG_DATA_TYPE && platform === LEGACY_PLATFORM) {
    index = LEGACY_LOG_INDEX;
  }
  return index;
};

const getLogServiceName = (
  dataType: string,
  platform: string,
): string | undefined => {
  const serviceName =
    dataType === LOG_DATA_TYPE ? serviceNameMapping[platform] : undefined;
  return serviceName;
};

const getEventPlatformName = (
  dataType: string,
  platform: string,
): string | undefined => {
  const platformName =
    dataType !== LOG_DATA_TYPE ? serviceNameMapping[platform] : undefined;
  return platformName;
};

const getDateField = (dataType: string): string => {
  return dataType === LOG_DATA_TYPE ? 'time' : 'date';
};

export const getElasticsearchFilter = (
  currentFilter: ElasticsearchFilterInterface,
  dataType: string,
  platform: string,
  eventName?: string,
): ElasticsearchFilterInterface => {
  const index = getIndex(dataType, platform);
  const serviceName = getLogServiceName(dataType, platform);
  const platformName = getEventPlatformName(dataType, platform);
  const dateField = getDateField(dataType);
  const newFilter = {
    ...currentFilter,
    dateField,
    eventName,
    index,
    platformName,
    serviceName,
  };
  return newFilter;
};

export const searchElastic = (
  filter: ElasticsearchFilterInterface,
): Cypress.Chainable<ElasticsearchResponseInterface | undefined> =>
  cy.task<ElasticsearchResponseInterface | undefined>('searchElastic', filter, {
    timeout: 600000,
  });
