import { DataProviderMetadata } from '@fc/data-provider-adapter-mongo';

export interface IDataProviderAdapter {
  getList(refreshCache?: boolean): Promise<DataProviderMetadata[]>;

  getById(id: string, refreshCache?: boolean): Promise<DataProviderMetadata>;

  getByClientId(
    clientId: string,
    refreshCache?: boolean,
  ): Promise<DataProviderMetadata>;
}
