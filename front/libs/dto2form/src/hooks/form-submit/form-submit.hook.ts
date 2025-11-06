import type { FormApi, SubmissionErrors } from 'final-form';
import { useCallback } from 'react';

import type { FormInterface } from '@fc/forms';

export const useFormSubmit = <T extends Record<string, unknown>>(
  onSubmit: FormInterface<T>['onSubmit'],
  onPreSubmit?: FormInterface<T>['onPreSubmit'],
  onPostSubmit?: FormInterface<T>['onPostSubmit'],
) => {
  const submitHandler = useCallback(
    async (values: T, form: FormApi<T, Partial<T>>) => {
      let preSubmitValues = values;
      if (onPreSubmit) {
        preSubmitValues = await onPreSubmit(values);
      }

      let errors: SubmissionErrors | void = await onSubmit(preSubmitValues, form);

      if (errors) {
        return errors;
      }

      if (onPostSubmit) {
        errors = await onPostSubmit(preSubmitValues, form);
      }

      return errors;
    },
    [onSubmit, onPreSubmit, onPostSubmit],
  );

  return submitHandler;
};
