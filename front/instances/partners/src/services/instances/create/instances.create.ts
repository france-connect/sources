import type { SubmissionErrors } from 'final-form';

import { HttpMethods } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { PartnersConfig } from '@fc/core-partners';
import { Options, PartnersService } from '@fc/core-partners';
import { type HttpClientDataInterface } from '@fc/http-client';

export const create = async (data: HttpClientDataInterface): Promise<SubmissionErrors> => {
  const { endpoints } = ConfigService.get<PartnersConfig>(Options.CONFIG_NAME);
  const { instances } = endpoints;

  const response = await PartnersService.commit(HttpMethods.POST, instances, data);
  return response;
};
