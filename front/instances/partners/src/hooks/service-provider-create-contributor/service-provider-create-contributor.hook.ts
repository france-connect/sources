import { useCallback, useMemo } from 'react';
import { useRevalidator } from 'react-router';

import { Strings } from '@fc/common';
import { PartnersAlertVariants } from '@fc/core-partners';
import { ButtonTypes, Priorities } from '@fc/dsfr';
import { removeEmptyValues } from '@fc/dto2form';
import { useDto2FormService } from '@fc/dto2form-service';
import type { FormConfigInterface } from '@fc/forms';
import type { HttpClientDataInterface } from '@fc/http-client';
import { t } from '@fc/i18n';
import { useNavigateWithState } from '@fc/routing';

export const useServiceProviderCreateContributor = () => {
  const { form, initialValues, schema, submitHandler } = useDto2FormService('ContributorCreate');

  const { revalidate } = useRevalidator();

  const { goBack, goBackWithSuccess } = useNavigateWithState();

  const postSubmit = useCallback(
    (values: HttpClientDataInterface) => {
      revalidate();
      goBackWithSuccess({
        message: t(
          'Partners.serviceProviderPage.usersSection.contributorCreate.success.description',
          { email: String(values.email) },
        ),
        title: t('Partners.serviceProviderPage.usersSection.contributorCreate.success', {
          NBSP_UNICODE: Strings.NBSP_UNICODE,
        }),
        variant: PartnersAlertVariants.CONTRIBUTOR,
      });
      return Promise.resolve(undefined);
    },
    [goBackWithSuccess, revalidate],
  );

  const config = useMemo<FormConfigInterface>(
    () => ({
      ...form,
      actions: [
        {
          label: 'Form.cancel',
          onClick: () => goBack(),
          priority: Priorities.SECONDARY,
          type: ButtonTypes.BUTTON,
        },
        {
          disabled: ({ canSubmit }) => !canSubmit,
          label: 'Partners.serviceProviderPage.usersSection.contributorCreate.submit',
          type: ButtonTypes.SUBMIT,
        },
      ],
    }),
    [form, goBack],
  );

  return {
    config,
    initialValues,
    postSubmit,
    preSubmit: removeEmptyValues,
    schema,
    submitHandler,
  };
};
