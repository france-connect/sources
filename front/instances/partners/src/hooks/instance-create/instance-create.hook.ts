import { useCallback } from 'react';

import { removeEmptyValues } from '@fc/dto2form';
import { useDto2FormService } from '@fc/dto2form-service';
import { useNavigateWithState } from '@fc/routing';

export const useInstanceCreate = () => {
  const { form, initialValues, schema, submitHandler } = useDto2FormService('InstancesCreate');

  const { goBackWithSuccess } = useNavigateWithState();

  const postSubmit = useCallback(() => {
    goBackWithSuccess({ title: 'Partners.instance.successCreate' });
    return Promise.resolve(undefined);
  }, [goBackWithSuccess]);

  return {
    config: form,
    initialValues,
    postSubmit,
    preSubmit: removeEmptyValues,
    schema,
    submitHandler,
  };
};
