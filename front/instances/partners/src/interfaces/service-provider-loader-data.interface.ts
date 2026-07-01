import type { ServiceProviderInterface } from '@fc/core-partners';

export interface ServiceProviderPageLoaderDataInterface extends ServiceProviderInterface {
  hasUnlinkedInstances: boolean;
}
