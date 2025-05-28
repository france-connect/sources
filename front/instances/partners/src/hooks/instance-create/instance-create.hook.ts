import has from 'lodash.has';
import { useCallback } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router';

import { parseInitialValues, type SchemaFieldType } from '@fc/dto2form';
import type { HttpClientDataInterface } from '@fc/http-client';

import { RouteLoaderDataIds, SubmitTypes, SubmitTypesMessage } from '../../enums';
import { InstancesService } from '../../services';

export const useInstanceCreate = () => {
  const navigate = useNavigate();
  const jsonSchema = useRouteLoaderData(RouteLoaderDataIds.VERSION_SCHEMA) as SchemaFieldType[];

  // @NOTE Temporary solution to resolve client id/secre display
  // While creating a new instance
  // @NOTE section are filtered too
  const schema = jsonSchema.filter((field) => !has(field, 'readonly') || !field.readonly);

  const initialValues = parseInitialValues(jsonSchema, {});

  const submitHandler = useCallback(
    async (data: HttpClientDataInterface) => {
      const errors = await InstancesService.create(data);
      if (errors) {
        return errors;
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

  return { initialValues, schema, submitHandler };
};
