import type { LoaderFunction, LoaderFunctionArgs } from 'react-router';

import { loadData } from '@fc/dto2form';

import type { LoadVersionResponseInterface } from '../../interfaces';

export const loadVersion =
  (endpoint: string): LoaderFunction =>
  async ({ params }: LoaderFunctionArgs) => {
    const response = (await loadData(endpoint)({
      params,
    } as LoaderFunctionArgs)) as LoadVersionResponseInterface;

    const { data } = response?.payload?.versions[0] || {};

    return data;
  };
