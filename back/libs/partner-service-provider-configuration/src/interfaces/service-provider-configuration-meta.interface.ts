/* istanbul ignore file */

// Declarative file
import { ServiceProviderConfigurationItemInterface } from './service-provider-configuration-item.interface';

export interface ServiceProviderConfigurationMetaInterface {
  total: number;
  items: ServiceProviderConfigurationItemInterface[];
}
