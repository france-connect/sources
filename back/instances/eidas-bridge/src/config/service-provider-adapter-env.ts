/* istanbul ignore file */

// Tested by DTO
/**
 * Rename this librairy into a more appropriate name `adapter`, `mongo`
 * @TODO #246
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/246
 */
import { ServiceProviderAdapterEnvConfig } from '@fc/service-provider-adapter-env';

import ServiceProviderAdapterEnvHigh from './service-provider-adapter-env-high';
import ServiceProviderAdapterEnvLow from './service-provider-adapter-env-low';

export default {
  list: [ServiceProviderAdapterEnvHigh, ServiceProviderAdapterEnvLow],
} as ServiceProviderAdapterEnvConfig;
