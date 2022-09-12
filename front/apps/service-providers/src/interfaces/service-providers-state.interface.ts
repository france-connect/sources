/* istanbul ignore file */

// declarative file
import { ServiceProvider } from './service-provider.interface';

export interface ServiceProvidersState {
  totalItems: number;
  items: ServiceProvider[];
  loading: boolean;
}
