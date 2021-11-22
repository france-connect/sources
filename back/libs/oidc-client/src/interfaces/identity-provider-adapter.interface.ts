import { IdentityProviderMetadata } from '@fc/oidc';

export interface IIdentityProviderAdapter {
  getList(refreshCache?: boolean): Promise<IdentityProviderMetadata[]>;

  getById(
    id: string,
    refreshCache?: boolean,
  ): Promise<IdentityProviderMetadata>;
}
