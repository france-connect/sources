export interface ElasticSearchResponse {
  hits: {
    hits: Array<{ _source: unknown }>;
  };
}
