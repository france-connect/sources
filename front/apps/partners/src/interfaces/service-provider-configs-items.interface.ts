/* istanbul ignore file */

// declarative file
import { ServiceProviderConfigItem } from './service-provider-config-item.interface';

export interface ServiceProviderConfigsItems {
  total: number;
  items: ServiceProviderConfigItem[];
}
