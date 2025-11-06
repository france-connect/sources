import { MessageTypes } from '@fc/common';
import { removeEmptyValues } from '@fc/dto2form';
import { useDto2FormService } from '@fc/dto2form-service';

import { SubmitTypesMessage } from '../../enums';
import { usePostSubmit } from '../post-submit';

export const useInstanceCreate = () => {
  const { form, initialValues, schema, submitHandler } = useDto2FormService('InstancesCreate');

  const postSubmit = usePostSubmit(
    SubmitTypesMessage.INSTANCE_SUCCESS_CREATE,
    MessageTypes.SUCCESS,
  );

  return {
    config: form,
    initialValues,
    postSubmit,
    preSubmit: removeEmptyValues,
    schema,
    submitHandler,
  };
};
