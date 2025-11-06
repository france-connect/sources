import { useLoaderData } from 'react-router';

import { MessageTypes } from '@fc/common';
import { removeEmptyValues } from '@fc/dto2form';
import { parseInitialValues, useDto2FormService } from '@fc/dto2form-service';

import { SubmitTypesMessage } from '../../enums';
import { usePostSubmit } from '../post-submit';

export const useInstanceUpdate = () => {
  const { form, schema, submitHandler } = useDto2FormService('InstancesUpdate');

  // @TODO #2356
  // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2356
  // schema and initialValues should be loaded from the server
  // should update the backend to return the version data
  // #region TODO
  const response = useLoaderData();
  const { data } = response.data?.payload?.versions[0] || {};
  const initialValues = parseInitialValues(schema, data);
  const { name: title } = data || {};
  // #endregion

  const postSubmit = usePostSubmit(
    SubmitTypesMessage.INSTANCE_SUCCESS_UPDATE,
    MessageTypes.SUCCESS,
  );

  return {
    config: { ...form, title },
    initialValues,
    postSubmit,
    preSubmit: removeEmptyValues,
    schema,
    submitHandler,
  };
};
