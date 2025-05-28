import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useLocalStorage } from 'usehooks-ts';

import type { FraudConfigInterface } from '@fc/user-dashboard';

export const useGetFraudSurveyOrigin = (options: FraudConfigInterface) => {
  const { surveyOriginQueryParam } = options;

  const [searchParams] = useSearchParams();

  const [localFraudData, setLocalFraudData, removeLocalFraudData] = useLocalStorage(
    surveyOriginQueryParam,
    { createdAt: Date.now(), value: '' },
  );

  const { createdAt, value: localFraudSurveyOrigin } = localFraudData;

  const currentFraudSurveyOrigin = searchParams.get(surveyOriginQueryParam);

  // @NOTE 30 minutes in milliseconds
  const maxAge = 30 * 60 * 1000;
  const isExpired = Date.now() - createdAt > maxAge;

  useEffect(() => {
    if (currentFraudSurveyOrigin) {
      setLocalFraudData({
        createdAt: Date.now(),
        value: currentFraudSurveyOrigin,
      });
    }
  }, [currentFraudSurveyOrigin, setLocalFraudData]);

  useEffect(() => {
    if (isExpired && localFraudSurveyOrigin) {
      removeLocalFraudData();
    }
  }, [isExpired, localFraudSurveyOrigin, removeLocalFraudData]);

  return currentFraudSurveyOrigin || localFraudSurveyOrigin;
};
