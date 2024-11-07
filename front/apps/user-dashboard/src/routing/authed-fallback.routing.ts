import type { Location } from 'react-router-dom';

import { AuthFallbackRoutes } from '@fc/routing';

import { Routes } from '../enums';

const AuthedMap: Partial<Record<Routes, Routes>> = {
  [Routes.FRAUD_FORM]: Routes.FRAUD_LOGIN,
};

export const authedFallback = (location: Location): string => {
  const { pathname } = location;

  return AuthedMap[pathname as Routes] || AuthFallbackRoutes.INDEX;
};
