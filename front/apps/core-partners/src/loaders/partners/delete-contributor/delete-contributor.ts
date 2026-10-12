import { generatePath } from 'react-router';

import type { UUIDType } from '@fc/common';
import { ConfigService } from '@fc/config';
import { deleteWithAuthHandling } from '@fc/http-client';

import { CorePartnersOptions } from '../../../enums';
import type { PartnersConfig } from '../../../interfaces';

// @NOTE this file does not belong in the `loaders` folder: it does not load
// data for a route but performs an action, it should live in an `actions` folder
export const deleteContributor = async (
  serviceProviderId: UUIDType,
  accountId: UUIDType,
): Promise<void> => {
  const { endpoints } = ConfigService.get<PartnersConfig>(CorePartnersOptions.CONFIG_NAME);
  const { serviceProviderContributors } = endpoints;

  const url = generatePath(serviceProviderContributors, { serviceProviderId });

  await deleteWithAuthHandling(url, { accountIds: [accountId] });
};
