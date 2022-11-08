/* istanbul ignore file */

// declarative file
import { ServiceProviders } from './service-providers.interface';

export interface ServiceProvidersState {
  totalItems: number;
  items: ServiceProviders[];
  loading: boolean;
}
