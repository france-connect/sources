import { ConfigService } from '@fc/config';
import { redirectToUrl } from '@fc/routing';

import { FraudOptions } from '../enums';
import type { FraudConfigInterface } from '../interfaces';

export const redirectToFraudSurvey = () => {
  const { fraudSurveyUrl } = ConfigService.get<FraudConfigInterface>(FraudOptions.CONFIG_NAME);

  redirectToUrl(fraudSurveyUrl);
};
