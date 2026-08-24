import { useCallback, useMemo } from 'react';
import { useLoaderData } from 'react-router';

import { normalizeEmptyValues } from '@fc/dto2form';
import { parseInitialValues, useDto2FormService } from '@fc/dto2form-service';
import type { HttpClientDataInterface } from '@fc/http-client';
import { useNavigateWithState } from '@fc/routing';

export const useInstanceUpdate = () => {
  const { form, schema, submitHandler } = useDto2FormService('InstancesUpdate');
  const { goBackWithSuccess } = useNavigateWithState();

  // @TODO #2356
  // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2356
  // schema and initialValues should be loaded from the server
  // should update the backend to return the version data
  // #region TODO
  const loaderData = useLoaderData();
  const versionData = loaderData?.data?.payload?.currentVersion?.data;
  // #endregion

  const formInitialValues = useMemo(() => {
    const values = parseInitialValues<HttpClientDataInterface>(schema, versionData);
    return values;
  }, [schema, versionData]);

  const preSubmit = useMemo(() => {
    const values = parseInitialValues<HttpClientDataInterface>(schema);
    return normalizeEmptyValues(values);
  }, [schema]);

  const postSubmit = useCallback(() => {
    goBackWithSuccess({ title: 'Partners.instance.successUpdate' });
  }, [goBackWithSuccess]);

  const config = useMemo(() => {
    const values = { ...form, title: versionData?.name };
    return values;
  }, [form, versionData?.name]);

  return {
    config,
    initialValues: formInitialValues,
    postSubmit,
    preSubmit,
    schema,
    submitHandler,
  };
};
