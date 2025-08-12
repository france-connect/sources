import type { LoaderFunction, LoaderFunctionArgs } from 'react-router';
import { generatePath } from 'react-router';

import { Dto2FormService } from '@fc/dto2form';

export const loadData =
  (endpoint: string): LoaderFunction =>
  async ({ params }: LoaderFunctionArgs) => {
    const url = generatePath(endpoint, params);

    return Dto2FormService.get(url);
  };
