import { useCallback } from 'react';
import { useLoaderData, useNavigate } from 'react-router';

import { useSafeContext } from '@fc/common';
import { removeEmptyValues } from '@fc/dto2form';
import { Dto2FormServiceContext, useDto2FormSubmitHandler } from '@fc/dto2form-service';

export const useSummaryPage = () => {
  const navigate = useNavigate();

  // @TODO replace once the API Back has been updated
  // With a single endpoint that returns the data and the schema
  const { data } = useLoaderData();
  const { form: schema, summary } = data;

  const { getConfigEndpointsById, getConfigFormById } = useSafeContext(Dto2FormServiceContext);

  const config = getConfigFormById('IdentityTheftSummary');
  const endpoints = getConfigEndpointsById('IdentityTheftSummary');

  const submitHandler = useDto2FormSubmitHandler(endpoints);

  const onPostSubmit = useCallback(() => {
    navigate('../success');
  }, [navigate]);

  return {
    config,
    onPostSubmit,
    onPreSubmit: removeEmptyValues,
    onSubmit: submitHandler,
    schema,
    summary,
  };
};
