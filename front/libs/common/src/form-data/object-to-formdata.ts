import isPlainObject from 'lodash.isplainobject';

import { FormDataError } from '../errors';

export const isString = (value: unknown) => typeof value === 'string';
export const isNumber = (value: unknown) => typeof value === 'number';
export const isBoolean = (value: unknown) => typeof value === 'boolean';
export const isSymbol = (value: unknown) => typeof value === 'symbol';

export const objectToFormData = (object: { [key: string]: unknown }) => {
  const isObject = isPlainObject(object);
  if (!isObject) {
    throw new FormDataError();
  }

  // @NOTE only String, Number, Boolean, and Symbol are supported
  // @NOTE api do not handle yet multipalt/form-data
  const resultFormData = new URLSearchParams();
  const entries = Object.entries(object);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entries.forEach(([key, value]: [string, any]) => {
    const isAllowedType = isString(value) || isNumber(value) || isBoolean(value) || isSymbol(value);
    if (isAllowedType) {
      const parsedValue = value.toString();
      resultFormData.append(key, parsedValue);
    }
  });
  return resultFormData;
};
