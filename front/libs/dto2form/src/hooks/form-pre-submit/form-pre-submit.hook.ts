import { useCallback } from 'react';

import { Strings } from '@fc/common';
import type { FormInterface } from '@fc/forms';
import { isString } from '@fc/validators';

export const useFormPreSubmit = <T extends Record<string, unknown>>(
  onSubmit: FormInterface<T>['onSubmit'],
) => {
  const preSubmitHandler = useCallback(
    (values: T) => {
      const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
        const isEmptyString = isString(value) && value === Strings.EMPTY_STRING;

        const isEmptyArray =
          Array.isArray(value) && value.every((string) => string === Strings.EMPTY_STRING);

        if (isEmptyString || isEmptyArray) {
          return acc;
        }

        return { ...acc, [key]: value };
      }, {} as T);

      return onSubmit(filteredValues);
    },
    [onSubmit],
  );

  return preSubmitHandler;
};
