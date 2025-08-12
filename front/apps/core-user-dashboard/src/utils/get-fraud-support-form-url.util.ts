import { Strings } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { FraudConfigInterface } from '@fc/core-user-dashboard';
import { FraudOptions } from '@fc/core-user-dashboard';

export const getFraudSupportFormUrl = (search: string): string => {
  const { fraudSupportFormPathname, supportFormUrl, surveyOriginQueryParam } =
    ConfigService.get<FraudConfigInterface>(FraudOptions.CONFIG_NAME);

  const searchParam = new URLSearchParams(search);

  // @NOTE
  // we must provide a fraudSurveyOrigin to the form in Formulaire Usager
  const surveyOrigin = searchParam.get(surveyOriginQueryParam) ?? FraudOptions.SURVEY_ORIGIN_UNKOWN;

  const fraudSupportFormUrl = `${supportFormUrl}${fraudSupportFormPathname}${Strings.SLASH}${surveyOrigin}`;

  return fraudSupportFormUrl;
};
