import type { LoaderFunctionArgs } from 'react-router';
import { generatePath } from 'react-router';

import type { FSAInterface, UUIDType } from '@fc/common';
import { ConfigService } from '@fc/config';
import { fetchWithAuthHandling } from '@fc/http-client';

import { CorePartnersOptions } from '../../../enums';
import type { InstanceInterface, PartnersConfig } from '../../../interfaces';

interface LinkableInstancesApiPayloadInterface {
  instances: InstanceInterface[];
  serviceProvider: {
    datapassRequestId: string;
    id: UUIDType;
    name: string;
  };
}

export interface LinkableInstancesByServiceProviderPayloadInterface {
  datapassRequestId: string;
  serviceProviderId: UUIDType;
  serviceProviderName: string;
  linkableInstances: InstanceInterface[];
}

export const loadLinkableInstancesByServiceProviderId = async ({
  params,
}: LoaderFunctionArgs): Promise<
  FSAInterface<LinkableInstancesByServiceProviderPayloadInterface>
> => {
  const { endpoints } = ConfigService.get<PartnersConfig>(CorePartnersOptions.CONFIG_NAME);
  const { linkableInstancesByServiceProviderId } = endpoints;

  if (!params.serviceProviderId) {
    throw new Error('[Partners] Missing "serviceProviderId" route parameter.');
  }

  const path = generatePath(linkableInstancesByServiceProviderId, {
    serviceProviderId: params.serviceProviderId,
  });

  const apiResponse =
    await fetchWithAuthHandling<Required<FSAInterface<LinkableInstancesApiPayloadInterface>>>(path);

  if (!apiResponse?.payload) {
    return {
      payload: {
        datapassRequestId: '',
        linkableInstances: [],
        serviceProviderId: params.serviceProviderId,
        serviceProviderName: '',
      },
      type: 'loadLinkableInstancesByServiceProviderId',
    };
  }

  const { payload, ...rest } = apiResponse;
  const { instances, serviceProvider } = payload;

  return {
    ...rest,
    payload: {
      datapassRequestId: serviceProvider.datapassRequestId,
      linkableInstances: instances,
      serviceProviderId: params.serviceProviderId,
      serviceProviderName: serviceProvider.name,
    },
  };
};
