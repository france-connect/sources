/* istanbul ignore file */

// declarative file
import { ServiceProviderItem } from './service-provider-item.interface';

export interface ServiceProvider {
  meta: {
    permissions: string[];
    urls: {
      edit: string;
      view: string;
    };
  };
  payload: ServiceProviderItem;
}
