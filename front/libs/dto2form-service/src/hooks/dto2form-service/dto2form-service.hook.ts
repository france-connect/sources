import { useMemo } from 'react';
import type { FormProps } from 'react-final-form';
import { useLoaderData } from 'react-router';

import { useSafeContext } from '@fc/common';
import type { SchemaFieldType } from '@fc/dto2form';
import type { FormConfigInterface } from '@fc/forms';
import type { HttpClientDataInterface } from '@fc/http-client';

import { Dto2FormServiceContext } from '../../context';
import { parseInitialValues, removeReadOnlyFields } from '../../helpers';
import { useDto2FormSubmitHandler } from '../dto2form-submit-handler';

interface Dto2FormServiceHookReturnType<T> {
  initialValues: T;
  form: FormConfigInterface;
  schema: SchemaFieldType[];
  submitHandler: FormProps<T>['submit'];
}

export const useDto2FormService = <T extends HttpClientDataInterface>(
  routeId: string,
): Dto2FormServiceHookReturnType<T> => {
  const { getConfigEndpointsById, getConfigFormById } = useSafeContext(Dto2FormServiceContext);

  const { data: loadedValues, schema: jsonSchema } = useLoaderData<{
    schema: SchemaFieldType[];
    data: T | null;
  }>();

  const endpoints = getConfigEndpointsById(routeId);
  const submitHandler = useDto2FormSubmitHandler(endpoints);

  const result = useMemo(() => {
    // @NOTE
    // Exemple :
    // -----------------------------------
    // client id and client secret
    // are not part of the form schema
    // during the process of creation.
    // they are created by the backend after the form submission.
    const isCreationModeForm = !loadedValues;
    const parsedSchema = isCreationModeForm ? removeReadOnlyFields(jsonSchema) : jsonSchema;

    return {
      form: getConfigFormById(routeId),
      initialValues: parseInitialValues<T>(jsonSchema, loadedValues),
      schema: parsedSchema,
      submitHandler,
    };
  }, [getConfigFormById, jsonSchema, loadedValues, routeId, submitHandler]);

  return result;
};
