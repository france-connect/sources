import { ConfigService } from '@fc/config';
import type { InstanceInterface, PartnersConfig } from '@fc/core-partners';
import { Options, PartnersService } from '@fc/core-partners';

export const loadAll = async () => {
  const { endpoints } = ConfigService.get<PartnersConfig>(Options.CONFIG_NAME);
  const { instances } = endpoints;

  const data = await PartnersService.get<{ payload: InstanceInterface[] }>(instances);
  return data;
};
