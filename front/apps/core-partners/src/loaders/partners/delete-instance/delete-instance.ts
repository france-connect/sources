import { generatePath } from 'react-router';

import type { UUIDType } from '@fc/common';
import { ConfigService } from '@fc/config';
import { deleteWithAuthHandling } from '@fc/http-client';

import { CorePartnersOptions } from '../../../enums';
import type { PartnersConfig } from '../../../interfaces';

// @NOTE this file does not belong in the `loaders` folder: it does not load
// data for a route but performs an action, it should live in an `actions` folder
export const deleteInstance = async (instanceId: UUIDType): Promise<void> => {
  const { endpoints } = ConfigService.get<PartnersConfig>(CorePartnersOptions.CONFIG_NAME);
  const { instance } = endpoints;

  const url = generatePath(instance, { instanceId });

  await deleteWithAuthHandling(url);
};
