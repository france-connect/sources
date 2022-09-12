/* istanbul ignore file */

// declarative file
import { IdentityProvider } from './identity-provider.interface';
import { Ministry } from './ministry.interface';

export interface PayloadEntities {
  identityProviders: {
    [key: string]: IdentityProvider;
  };
  ministries: {
    [key: string]: Ministry;
  };
}
