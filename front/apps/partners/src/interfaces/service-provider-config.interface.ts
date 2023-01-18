/* istanbul ignore file */

// declarative file
import { FSA } from '@fc/common';

import { ServiceProviderConfigPayload } from './service-provider-config-payload.interface';

export type ServiceProviderConfig = Required<
  Pick<
    FSA<
      {
        total: number;
        urls: {
          delete: string;
          view: string;
        };
      },
      ServiceProviderConfigPayload
    >,
    'payload' | 'meta'
  >
>;
