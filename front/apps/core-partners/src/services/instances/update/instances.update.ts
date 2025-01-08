import type { SubmissionErrors } from 'final-form';

import { HttpMethods } from '@fc/common';
import { ConfigService } from '@fc/config';
import { type HttpClientDataInterface } from '@fc/http-client';

import { Options } from '../../../enums';
import type { PartnersConfig } from '../../../interfaces';
import { AbstractService } from '../../abstract';

export const update = async (
  data: HttpClientDataInterface,
  instanceId: string,
): Promise<SubmissionErrors> => {
  const { endpoints } = ConfigService.get<PartnersConfig>(Options.CONFIG_NAME);
  const { instances } = endpoints;

  const url = `${instances}/${instanceId}`;
  const response = await AbstractService.commit(HttpMethods.PUT, url, data);
  return response;
};
