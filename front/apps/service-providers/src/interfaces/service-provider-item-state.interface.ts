/* istanbul ignore file */

// declarative file
import { ServiceProvider } from './service-provider.interface';

export interface ServiceProviderItemState {
  item: ServiceProvider | undefined;
  loading: boolean;
}
