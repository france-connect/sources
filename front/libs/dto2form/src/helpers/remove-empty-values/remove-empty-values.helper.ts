import { Strings } from '@fc/common';
import type { HttpClientDataInterface } from '@fc/http-client';

export const removeEmptyValues = (values: HttpClientDataInterface): HttpClientDataInterface => {
  const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
    const isEmptyString = value === Strings.EMPTY_STRING;

    const isEmptyArray =
      Array.isArray(value) && value.every((string) => string === Strings.EMPTY_STRING);

    if (isEmptyString || isEmptyArray) {
      return acc;
    }

    return { ...acc, [key]: value };
  }, {});

  return filteredValues;
};
