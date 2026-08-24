import { useCallback } from 'react';
import { useRevalidator } from 'react-router';

import { PartnersAlertVariants } from '@fc/core-partners';
import { removeEmptyValues } from '@fc/dto2form';
import { useDto2FormService } from '@fc/dto2form-service';
import type { HttpClientDataInterface } from '@fc/http-client';
import { t } from '@fc/i18n';
import { useNavigateWithState } from '@fc/routing';

export const useServiceProviderCreateInstance = () => {
  const { form, initialValues, schema, submitHandler } = useDto2FormService(
    'ServiceProviderCreateInstance',
  );
  const { revalidate } = useRevalidator();

  const { goBackWithSuccess } = useNavigateWithState();

  const postSubmit = useCallback(
    (values: HttpClientDataInterface) => {
      const submitState = {
        title: t('Partners.serviceProvider.createInstance.success', {
          instanceName: String(values.name),
        }),
        variant: PartnersAlertVariants.INSTANCE,
      };
      revalidate();
      goBackWithSuccess(submitState);
    },
    [goBackWithSuccess, revalidate],
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
