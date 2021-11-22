import { AllClientMetadata } from 'oidc-provider';

export interface CustomClientMetadata extends AllClientMetadata {
  active: boolean;
  name: string;
  entityId: string;
  idpFilterExclude: boolean;
  idpFilterList: string[];
}

/**
 * Alias and export interface provided by `node-oidc-provider` from our module,
 * so that we do not expose our depency to `node-oidc-provider`.
 */
export type ServiceProviderMetadata = CustomClientMetadata;

export interface IServiceProviderAdapter {
  getList(refreshCache?: boolean): Promise<ServiceProviderMetadata[]>;
  shouldExcludeIdp(spId: string, idpId: string): Promise<boolean>;
  getById(id: string): Promise<ServiceProviderMetadata>;
}
