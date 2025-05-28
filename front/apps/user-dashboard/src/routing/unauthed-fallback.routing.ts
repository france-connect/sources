import type { Location } from 'react-router';

import { Routes } from '../enums';

const UnauthedMap: Partial<Record<Routes, Routes>> = {
  [Routes.FRAUD_LOGIN]: Routes.FRAUD_FORM,
};

export const unauthedFallback = (location: Location): string => {
  const { pathname } = location;

  return UnauthedMap[pathname as Routes] || Routes.HISTORY;
};
