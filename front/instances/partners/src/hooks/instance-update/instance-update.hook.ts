import { useCallback } from 'react';
import { useLoaderData } from 'react-router';

import { removeEmptyValues } from '@fc/dto2form';
import { parseInitialValues, useDto2FormService } from '@fc/dto2form-service';
import { useNavigateWithState } from '@fc/routing';

export const useInstanceUpdate = () => {
  const { form, schema, submitHandler } = useDto2FormService('InstancesUpdate');
  const { goBackWithSuccess } = useNavigateWithState();

  // @TODO #2356
  // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2356
  // schema and initialValues should be loaded from the server
  // should update the backend to return the version data
  // #region TODO
  const response = useLoaderData();
  const { data } = response.data?.payload?.currentVersion || {};
  const initialValues = parseInitialValues(schema, data);
  const { name: title } = data || {};
  // #endregion

  const postSubmit = useCallback(() => {
    goBackWithSuccess({ title: 'Partners.instance.successUpdate' });
  }, [goBackWithSuccess]);

  return {
    config: { ...form, title },
    initialValues,
    postSubmit,
    preSubmit: removeEmptyValues,
    schema,
    submitHandler,
  };
};
