import { ConfigService } from '@fc/config';
import type { JSONFieldType } from '@fc/dto2form';

import { Options } from '../../../enums';
import type { PartnersConfig } from '../../../interfaces';
import { AbstractService } from '../../abstract';

export const loadSchema = async () => {
  const { schemas } = ConfigService.get<PartnersConfig>(Options.CONFIG_NAME);
  const { versions } = schemas;

  const data = await AbstractService.get<JSONFieldType[]>(versions);
  return data;
};
