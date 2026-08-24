import { generatePath } from 'react-router';

import type { UUIDType } from '@fc/common';
import { ConfigService } from '@fc/config';
import { del } from '@fc/http-client';

import { CorePartnersOptions } from '../../../enums';
import type { PartnersConfig } from '../../../interfaces';

export const deleteInstance = async (instanceId: UUIDType): Promise<void> => {
  const { endpoints } = ConfigService.get<PartnersConfig>(CorePartnersOptions.CONFIG_NAME);
  const { instance } = endpoints;

  const url = generatePath(instance, { instanceId });

  await del(url);
};
