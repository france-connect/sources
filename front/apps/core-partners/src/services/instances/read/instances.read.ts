import type { LoaderFunctionArgs } from 'react-router-dom';

import { ConfigService } from '@fc/config';

import { Options } from '../../../enums';
import type { PartnersConfig, RouteParamsInterface, VersionInterface } from '../../../interfaces';
import { AbstractService } from '../../abstract';

export const read = async ({ params }: LoaderFunctionArgs) => {
  const { instanceId } = params as unknown as RouteParamsInterface;
  const { endpoints } = ConfigService.get<PartnersConfig>(Options.CONFIG_NAME);
  const { instances } = endpoints;

  const url = `${instances}/${instanceId}`;
  const data = await AbstractService.get<{ payload: VersionInterface }>(url);
  return data;
};
