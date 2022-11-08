/* istanbul ignore file */

// declarative file
import { ServiceProvider } from './service-provider.interface';

export interface ServiceProviders {
  meta: {
    permissions: string[];
    urls: {
      edit: string;
      view: string;
    };
  };
  payload: ServiceProvider;
}
