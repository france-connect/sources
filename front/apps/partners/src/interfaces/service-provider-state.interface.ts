/* istanbul ignore file */

// declarative file
import { ServiceProviders } from './service-providers.interface';

export interface ServiceProviderState {
  item: ServiceProviders | undefined;
  loading: boolean;
}
