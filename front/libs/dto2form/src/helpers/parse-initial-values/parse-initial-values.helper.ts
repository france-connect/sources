import has from 'lodash.has';

import type { SchemaFieldType } from '../../types';

export const parseInitialValues = <T = string | string[]>(
  schema: SchemaFieldType[] | undefined,
  values: Record<string, T>,
): Record<string, T> => {
  if (!schema) {
    return {};
  }

  const initialValues = schema.reduce((acc, schemaField) => {
    // @TODO this should be refactored
    if (!has(schemaField, 'initialValue')) {
      return acc;
    }
    // @TODO this should be refactored
    const { initialValue, name } = schemaField;
    const value = has(values, name) ? values[name] : initialValue;
    return { ...acc, [name]: value };
  }, {});

  return initialValues;
};
