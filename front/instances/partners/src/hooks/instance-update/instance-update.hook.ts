import { useCallback } from 'react';
import { useLoaderData, useNavigate, useParams, useRouteLoaderData } from 'react-router-dom';

import type { InstanceInterface, ResponseInterface, RouteParamsInterface } from '@fc/core-partners';
import { parseInitialValues, type SchemaFieldType } from '@fc/dto2form';
import type { HttpClientDataInterface } from '@fc/http-client';

import { RouteLoaderDataIds, SubmitTypes, SubmitTypesMessage } from '../../enums';
import { InstancesService } from '../../services';

export const useInstanceUpdate = () => {
  const navigate = useNavigate();
  const { instanceId } = useParams() as unknown as RouteParamsInterface;
  const response = useLoaderData() as ResponseInterface<InstanceInterface>;
  const schema = useRouteLoaderData(RouteLoaderDataIds.VERSION_SCHEMA) as SchemaFieldType[];

  const { data: responseData } = response?.payload?.versions[0] || {};

  const title = responseData?.name;
  const initialValues = parseInitialValues(schema, responseData);

  const submitHandler = useCallback(
    async (data: HttpClientDataInterface) => {
      const errors = await InstancesService.update(data, instanceId);
      if (errors) {
        return errors;
      }

      const submitState = {
        message: SubmitTypesMessage.INSTANCE_SUCCESS_UPDATE,
        type: SubmitTypes.SUCCESS,
      };

      navigate('..', { replace: true, state: { submitState } });
      return null;
    },
    [navigate, instanceId],
  );

  return { initialValues, schema, submitHandler, title };
};
