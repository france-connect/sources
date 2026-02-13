import { Client, estypes } from '@elastic/elasticsearch';

let esClient: Client | null = null;

// Initialize Elasticsearch client
export const initEsPlugin = (config: Cypress.ConfigOptions): void => {
  // Don't initialize if ELASTICSEARCH_URL is not set
  if (config.env.ELASTICSEARCH_URL === undefined) {
    return;
  }

  const esConfig = {
    password: config.env.ELASTICSEARCH_PASSWORD,
    url: config.env.ELASTICSEARCH_URL,
    username: config.env.ELASTICSEARCH_USERNAME,
  };
  esClient = new Client({
    auth: { password: esConfig.password, username: esConfig.username },
    nodes: esConfig.url,
    tls: { rejectUnauthorized: false },
  });
};

// Query builder
class QueryBuilder {
  private searchParams: estypes.SearchRequest;

  constructor(index: string | string[], size = 2000) {
    this.searchParams = {
      index,
      query: {
        bool: {
          filter: [],
        },
      },
      size,
    };
  }

  private getCurrentFilter(): estypes.QueryDslQueryContainer[] {
    if (!Array.isArray(this.searchParams.query?.bool?.filter)) {
      if (!this.searchParams.query) this.searchParams.query = { bool: {} };
      if (!this.searchParams.query.bool) this.searchParams.query.bool = {};
      this.searchParams.query.bool.filter = [];
    }
    return this.searchParams.query.bool
      .filter as estypes.QueryDslQueryContainer[];
  }

  withTerm(field: string, value: string) {
    this.getCurrentFilter().push({
      term: { [field]: value },
    });
    return this;
  }

  withMatch(field: string, value: string) {
    this.getCurrentFilter().push({
      match: { [field]: value },
    });
    return this;
  }

  withDateRange(dateField: string, startDate: string, endDate: string) {
    const dateRange = {
      format: 'strict_date_optional_time',
      gte: startDate,
      lte: endDate,
    };
    this.getCurrentFilter().push({
      range: { [dateField]: dateRange },
    });
    return this;
  }

  build(): estypes.SearchRequest {
    // eslint-disable-next-line no-console
    console.debug(JSON.stringify(this.searchParams, null, 2));
    return this.searchParams;
  }
}

// Elasticsearch plugins

interface SearchArgsInterface {
  dateField?: string;
  endDate?: string;
  eventName?: string;
  index: string;
  platformName?: string;
  size?: number;
  serviceName?: string;
  startDate?: string;
}

export const searchElastic = async (
  args: SearchArgsInterface,
): Promise<estypes.SearchResponse | null> => {
  const {
    dateField,
    endDate,
    eventName,
    index,
    platformName,
    serviceName,
    size,
    startDate,
  } = args;

  if (!esClient) {
    throw new Error('Elasticsearch client is not initialized');
  }
  // eslint-disable-next-line no-console
  console.debug(
    `Searching in index "${index}" for event "${eventName}", platform "${platformName}", service "${serviceName}", size "${size}", startDate "${startDate}", endDate "${endDate}"`,
  );
  const queryBuilder = new QueryBuilder(index, size);
  if (eventName) {
    queryBuilder.withMatch('event', eventName);
  }
  if (platformName) {
    queryBuilder.withTerm('platform', platformName);
  }
  if (serviceName) {
    queryBuilder.withTerm('service', serviceName);
  }
  if (dateField && startDate && endDate) {
    queryBuilder.withDateRange(dateField, startDate, endDate);
  }
  const query = queryBuilder.build();

  try {
    const searchResponse = await esClient.search(query);
    return searchResponse as estypes.SearchResponse;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error searching in index "${index}": ${error}`);
  }
  return null;
};
