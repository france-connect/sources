import { useCallback } from 'react';
import { generatePath, useParams } from 'react-router';

import type { HttpClientDataInterface } from '@fc/http-client';

import type { Dto2FormFormConfigInterface } from '../../interfaces';
import { Dto2FormService } from '../../services';

export const useSubmitHandler = (form: Dto2FormFormConfigInterface) => {
  const params = useParams();
  const handler = useCallback(
    async (data: HttpClientDataInterface) => {
      const url = generatePath(form.endpoints.submit.path, params);
      const { method } = form.endpoints.submit;
      const errors = await Dto2FormService.commit(method, url, data);

      if (errors) {
        return errors;
      }

      return null;
    },
    [form, params],
  );

  return handler;
};
