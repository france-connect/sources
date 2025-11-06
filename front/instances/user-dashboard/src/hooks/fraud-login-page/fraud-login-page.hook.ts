import { useLocation } from 'react-router';
import { useToggle } from 'usehooks-ts';

import { Strings } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { FraudConfigInterface } from '@fc/core-user-dashboard';
import { FraudOptions } from '@fc/core-user-dashboard';

export const useFraudLoginPage = () => {
  const { identityTheftReportRoute } = ConfigService.get<FraudConfigInterface>(
    FraudOptions.CONFIG_NAME,
  );

  const [expanded, toggleExpanded] = useToggle(false);

  const location = useLocation();

  return {
    expanded,
    identityTheftReportRoute,
    search: location.state?.from?.search || Strings.EMPTY_STRING,
    toggleExpanded,
  };
};
