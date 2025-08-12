import { has } from 'lodash';

import type { SchemaFieldType } from '../../types';

export const parseInitialValues = <T>(schema: SchemaFieldType[] | undefined, values: T): T => {
  if (!schema) {
    return {} as T;
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

  return initialValues as T;
};
