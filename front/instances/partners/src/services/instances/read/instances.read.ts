import type { LoaderFunctionArgs } from 'react-router-dom';

import { ConfigService } from '@fc/config';
import type { PartnersConfig, RouteParamsInterface, VersionInterface } from '@fc/core-partners';
import { Options, PartnersService } from '@fc/core-partners';

export const read = async ({ params }: LoaderFunctionArgs) => {
  const { instanceId } = params as unknown as RouteParamsInterface;
  const { endpoints } = ConfigService.get<PartnersConfig>(Options.CONFIG_NAME);
  const { instances } = endpoints;

  const url = `${instances}/${instanceId}`;
  const data = await PartnersService.get<{ payload: VersionInterface }>(url);
  return data;
};
