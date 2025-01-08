import type { SubmissionErrors } from 'final-form';

import { HttpMethods } from '@fc/common';
import { ConfigService } from '@fc/config';
import { type HttpClientDataInterface } from '@fc/http-client';

import { Options } from '../../../enums';
import type { PartnersConfig } from '../../../interfaces';
import { AbstractService } from '../../abstract';

export const create = async (data: HttpClientDataInterface): Promise<SubmissionErrors> => {
  const { endpoints } = ConfigService.get<PartnersConfig>(Options.CONFIG_NAME);
  const { instances } = endpoints;

  const response = await AbstractService.commit(HttpMethods.POST, instances, data);
  return response;
};
