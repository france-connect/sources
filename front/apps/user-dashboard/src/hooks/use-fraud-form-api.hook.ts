import { useCallback, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { post } from '@fc/http-client';

import type { FraudConfigInterface, FraudFormValuesInterface } from '../interfaces';

export const useFraudFormApi = (options: FraudConfigInterface) => {
  const [, , removeLocalFraudSurveyOrigin] = useLocalStorage(options.surveyOriginQueryParam, {
    createdAt: Date.now(),
    value: '',
  });

  const [submitErrors, setSubmitErrors] = useState<Error | undefined>(undefined);
  const [submitWithSuccess, setSubmitWithSuccess] = useState(false);

  const commit = useCallback(
    async ({
      authenticationEventId,
      comment,
      contactEmail,
      fraudSurveyOrigin,
      idpEmail,
      phoneNumber,
    }: FraudFormValuesInterface) => {
      const data = {
        authenticationEventId,
        comment,
        contactEmail,
        fraudSurveyOrigin,
        idpEmail,
        phoneNumber,
      };
      try {
        await post(options.apiRouteFraudForm, data);
        setSubmitErrors(undefined);
        removeLocalFraudSurveyOrigin();
        setSubmitWithSuccess(true);
      } catch (err) {
        setSubmitErrors(err as Error);
        setSubmitWithSuccess(false);
      }
    },
    [options.apiRouteFraudForm, removeLocalFraudSurveyOrigin],
  );

  return {
    commit,
    submitErrors,
    submitWithSuccess,
  };
};
