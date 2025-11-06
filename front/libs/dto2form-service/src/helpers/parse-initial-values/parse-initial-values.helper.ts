import { has } from 'lodash';

import type { SchemaFieldType } from '@fc/dto2form';

export const parseInitialValues = <T>(
  schema: SchemaFieldType[] | undefined,
  values: T | null,
): T => {
  if (!schema) {
    return {} as T;
  }

  const initialValues = schema.reduce((acc, schemaField) => {
    if (!has(schemaField, 'initialValue')) {
      return acc;
    }
    const { initialValue, name } = schemaField;
    const value = has(values, name) ? values[name] : initialValue;
    return { ...acc, [name]: value };
  }, {});

  return initialValues as T;
};
