import { OidcClientInterface } from '@fc/service-provider';

export interface ExistingDataInterface {
  mutable: Partial<Omit<OidcClientInterface, 'client_id' | 'client_secret'>>;
  immutable: Pick<OidcClientInterface, 'client_id' | 'client_secret'>;
}
