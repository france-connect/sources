import { ServiceProviderAdapterEnvConfig } from '@fc/service-provider-adapter-env';

import ServiceProviderAdapterEnvHigh from './service-provider-adapter-env-high';
import ServiceProviderAdapterEnvLow from './service-provider-adapter-env-low';

export default {
  list: [ServiceProviderAdapterEnvHigh, ServiceProviderAdapterEnvLow],
} as ServiceProviderAdapterEnvConfig;
