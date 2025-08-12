import { ConfigService } from '@fc/config';
import type { InstanceInterface, PartnersConfig } from '@fc/core-partners';
import { Options } from '@fc/core-partners';
import { Dto2FormService } from '@fc/dto2form';

export const loadAll = async () => {
  const { endpoints } = ConfigService.get<PartnersConfig>(Options.CONFIG_NAME);
  const { instances } = endpoints;

  const data = await Dto2FormService.get<{ payload: InstanceInterface[] }>(instances);
  return data;
};
