/* istanbul ignore file */

// declarative file
import { FSA } from '@fc/common';

import { ServiceProviderConfigsPayload } from './service-provider-configs-payload.interface';

export type ServiceProviderConfigs = Required<
  Pick<FSA<{ total: number }, ServiceProviderConfigsPayload[]>, 'payload' | 'meta'>
>;
