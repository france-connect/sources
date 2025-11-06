import { useCallback } from 'react';
import { generatePath, useParams } from 'react-router';

import type { HttpClientDataInterface } from '@fc/http-client';

import type { Dto2FormServiceFormConfigInterface } from '../../interfaces';
import { dto2FormServiceCommit } from '../../services';

export const useDto2FormSubmitHandler = (
  endpoints: Dto2FormServiceFormConfigInterface['endpoints'],
) => {
  const params = useParams();
  const handler = useCallback(
    async (data: HttpClientDataInterface) => {
      const { method, path } = endpoints.submit;
      const url = generatePath(path, params);
      const result = await dto2FormServiceCommit(method, url, data);
      return result;
    },
    [endpoints, params],
  );

  return handler;
};
