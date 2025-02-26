import { ConfigService } from '@fc/config';
import { Options, type PartnersConfig, PartnersService } from '@fc/core-partners';
import type { SchemaFieldType } from '@fc/dto2form';

export const loadSchema = async () => {
  const { schemas } = ConfigService.get<PartnersConfig>(Options.CONFIG_NAME);
  const { versions } = schemas;

  const data = await PartnersService.get<SchemaFieldType[]>(versions);
  return data;
};
