import isEmpty from 'lodash.isempty';
import { useCallback } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';

import { InstancesService } from '@fc/core-partners';
import type { JSONFieldType } from '@fc/dto2form';
import { UNKNOWN_FORM_ERROR } from '@fc/forms';
import type { HttpClientDataInterface } from '@fc/http-client';

import { RouteLoaderDataIds, SubmitTypes, SubmitTypesMessage } from '../../enums';

export const useInstanceCreate = () => {
  const navigate = useNavigate();
  const schema = useRouteLoaderData(RouteLoaderDataIds.VERSION_SCHEMA) as JSONFieldType[];

  const submitHandler = useCallback(
    async (data: HttpClientDataInterface) => {
      const response = await InstancesService.create(data);

      const hasSubmissionErrors = !response || !isEmpty(response.payload);
      if (hasSubmissionErrors) {
        return (response && response.payload) || UNKNOWN_FORM_ERROR;
      }

      const submitState = {
        message: SubmitTypesMessage.INSTANCE_SUCCESS_CREATE,
        type: SubmitTypes.SUCCESS,
      };

      navigate('..', { replace: true, state: { submitState } });
      return null;
    },
    [navigate],
  );

  return { schema, submitHandler };
};
