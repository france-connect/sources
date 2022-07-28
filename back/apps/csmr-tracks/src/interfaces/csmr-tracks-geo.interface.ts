/* istanbul ignore file */

// Declarative code
export interface IGeo {
  country: string;
  city: string;
}

/**
 * Note: here is the ElasticSearch geo pipeline result
  export interface ISource {
    readonly geo: {
      region_name?: string;
      region_iso_code?: string;
      city_name?: string;
      country_iso_code?: string;
      country_name?: string;
      continent_name?: string;
      location: {
        lon: number;
        lat: number;
      };
    };
  }
 * 
 */

export type ICsmrTracksGeoData = {
  'source.geo.city_name': string;
  'source.geo.country_iso_code': string;
  'source.geo.region_name': string;
};
