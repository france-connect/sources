import { IdentityProvider } from './identity-provider.interface';
import { Ministry } from './ministry.interface';

export interface PayloadState {
  csrfToken: string;
  identityProviders: IdentityProvider[];
  isLoaded: boolean;
  ministries: Ministry[];
  serviceProviderName: string | undefined;
}
