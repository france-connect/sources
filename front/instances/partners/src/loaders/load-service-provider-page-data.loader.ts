import type { LoaderFunctionArgs } from 'react-router';

import type { FSAInterface } from '@fc/common';
import type { ServiceProviderInterface } from '@fc/core-partners';
import { PartnersService } from '@fc/core-partners';

export interface ServiceProviderPageLoaderDataInterface extends ServiceProviderInterface {
  hasUnlinkedInstances: boolean;
}

export const loadServiceProviderPageData = async ({
  params,
}: LoaderFunctionArgs): Promise<FSAInterface<ServiceProviderPageLoaderDataInterface>> => {
  const [serviceProviderData, linkableInstancesData] = await Promise.all([
    PartnersService.loadServiceProviderById({ params } as LoaderFunctionArgs),
    PartnersService.loadLinkableInstancesByServiceProviderId({ params } as LoaderFunctionArgs),
  ]);

  const { payload: serviceProvider } = serviceProviderData as Required<
    FSAInterface<ServiceProviderInterface>
  >;
  const { payload: linkablePayload } = linkableInstancesData as Required<
    FSAInterface<{ linkableInstances: unknown[] }>
  >;
  const hasUnlinkedInstances = linkablePayload.linkableInstances.length > 0;

  return {
    payload: {
      ...serviceProvider,
      hasUnlinkedInstances,
    },
    type: 'loadServiceProviderPageData',
  };
};
