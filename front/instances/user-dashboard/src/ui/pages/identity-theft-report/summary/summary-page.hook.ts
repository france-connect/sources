import { useCallback } from 'react';
import { useLoaderData, useNavigate } from 'react-router';

import { ConfigService } from '@fc/config';
import { type Dto2FormConfigInterface, removeEmptyValues, useSubmitHandler } from '@fc/dto2form';
import { t } from '@fc/i18n';

export const useSummaryPage = () => {
  const navigate = useNavigate();

  const { form: schema, summary } = useLoaderData();

  const phonevalue = summary.contact.phone
    ? summary.contact.phone
    : t('Fraud.IdentityTheftReport.summaryNoPhone');

  const values = {
    ...summary,
    contact: {
      ...summary.contact,
      phone: phonevalue,
    },
  };

  // @TODO replace by import { Options.CONFIG_NAME } from '@fc/dto2form';
  const { IdentityTheftSummary } = ConfigService.get<Dto2FormConfigInterface>('Dto2Form');

  const submitHandler = useSubmitHandler(IdentityTheftSummary);

  const onPostSubmit = useCallback(() => {
    navigate('../success');
  }, [navigate]);

  return {
    config: IdentityTheftSummary,
    onPostSubmit,
    onPreSubmit: removeEmptyValues,
    onSubmit: submitHandler,
    schema,
    values,
  };
};
