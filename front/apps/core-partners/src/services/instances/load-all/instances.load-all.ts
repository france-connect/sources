import { ConfigService } from '@fc/config';

import { Options } from '../../../enums';
import type { InstanceInterface, PartnersConfig } from '../../../interfaces';
import { AbstractService } from '../../abstract';

export const loadAll = async () => {
  const { endpoints } = ConfigService.get<PartnersConfig>(Options.CONFIG_NAME);
  const { instances } = endpoints;

  const data = await AbstractService.get<{ payload: InstanceInterface[] }>(instances);
  return data;
};
