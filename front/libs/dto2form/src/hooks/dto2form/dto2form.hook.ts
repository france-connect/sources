import { has } from 'lodash';
import { useMemo } from 'react';
import { useRouteLoaderData } from 'react-router';

import type { SubmitHandlerType } from '@fc/forms';
import type { HttpClientDataInterface } from '@fc/http-client';

import { parseInitialValues } from '../../helpers';
import type { Dto2FormFormConfigInterface } from '../../interfaces';
import type { SchemaFieldType } from '../../types';
import { useSubmitHandler } from '../submit-handler';

export const useDto2Form = <T extends HttpClientDataInterface>(
  form: Dto2FormFormConfigInterface,
): { initialValues: T; schema: SchemaFieldType[]; submitHandler: SubmitHandlerType<T> } => {
  const jsonSchema = useRouteLoaderData(form.endpoints.schema.path) as SchemaFieldType[];

  const loadedValues = useRouteLoaderData(form.endpoints.load?.path as string);

  // @TODO move to a useMemo hook
  let values = loadedValues;
  let schema = jsonSchema;

  if (!loadedValues) {
    // @TODO move to a useMemo hook
    schema = jsonSchema.filter((field) => !has(field, 'readonly') || !field.readonly);
    values = {};
  }

  // @TODO move to a useMemo hook
  const initialValues = parseInitialValues<T>(jsonSchema, values);

  const submitHandler = useSubmitHandler(form);

  const result = useMemo(
    () => ({ initialValues, schema, submitHandler }),
    [initialValues, schema, submitHandler],
  );

  return result;
};
