import { ConfigService } from '@fc/config';
import { post } from '@fc/http-client';

import { CorePartnersOptions } from '../../../enums';
import type { PartnersConfig } from '../../../interfaces';

export interface LinkInstancesToServiceProviderPayloadInterface {
  serviceProviderId: string;
  instanceIds: string[];
}

export const linkInstancesToServiceProvider = async ({
  instanceIds,
  serviceProviderId,
}: LinkInstancesToServiceProviderPayloadInterface): Promise<void> => {
  const { endpoints } = ConfigService.get<PartnersConfig>(CorePartnersOptions.CONFIG_NAME);
  const { linkInstances } = endpoints;

  await post(linkInstances, {
    instanceIds,
    serviceProviderId,
  });
};
