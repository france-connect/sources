export interface SourceInterface {
  readonly geo: TracksGeoDataInterface;
  readonly address: string[];
  readonly port: string;
  // Input data
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly original_addresses: string;
}

export interface TracksGeoDataInterface {
  // Input data
  // eslint-disable-next-line @typescript-eslint/naming-convention
  region_name?: string;
  // Input data
  // eslint-disable-next-line @typescript-eslint/naming-convention
  region_iso_code?: string;
  // Input data
  // eslint-disable-next-line @typescript-eslint/naming-convention
  city_name?: string;
  // Input data
  // eslint-disable-next-line @typescript-eslint/naming-convention
  country_iso_code?: string;
  // Input data
  // eslint-disable-next-line @typescript-eslint/naming-convention
  country_name?: string;
  // Input data
  // eslint-disable-next-line @typescript-eslint/naming-convention
  continent_name?: string;
  location: {
    lon: number;
    lat: number;
  };
}
