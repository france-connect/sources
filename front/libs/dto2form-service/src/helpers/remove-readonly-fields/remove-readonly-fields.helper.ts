import { has } from 'lodash';

import type { SchemaFieldType } from '@fc/dto2form';

export const removeReadOnlyFields = (schema: SchemaFieldType[]): SchemaFieldType[] =>
  schema.filter((field) => !has(field, 'readonly') || !field.readonly);
