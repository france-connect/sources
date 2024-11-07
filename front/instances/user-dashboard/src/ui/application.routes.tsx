/* istanbul ignore file */

// declarative file
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ApplicationLayout } from '@fc/layout';
import { AuthedRoute, UnauthedRoute } from '@fc/routing';
import { authedFallback, unauthedFallback } from '@fc/user-dashboard';

import {
  Error409Component,
  ErrorGenericComponent,
  ErrorPage,
  HomePage,
  NotFoundPage,
  TracksPage,
  UserPreferencesPage,
} from './pages';
import { FraudFormPage } from './pages/fraud-form';
import { FraudLoginPage } from './pages/fraud-login';

export const ApplicationRoutes = React.memo(() => (
  <Routes>
    <Route element={<ApplicationLayout />} path="/">
      <Route element={<AuthedRoute fallback={authedFallback} />}>
        <Route element={<TracksPage />} path="history" />
        <Route element={<UserPreferencesPage />} path="preferences" />
        <Route element={<FraudFormPage />} path="fraud/form" />
      </Route>
      <Route element={<UnauthedRoute fallback={unauthedFallback} />}>
        <Route element={<FraudLoginPage />} path="fraud" />
        <Route index element={<HomePage />} />
      </Route>
      <Route element={<ErrorPage />} path="error">
        <Route index element={<ErrorGenericComponent />} />
        <Route element={<Error409Component />} path="409" />
      </Route>
      <Route element={<NotFoundPage />} path="*" />
    </Route>
  </Routes>
));

ApplicationRoutes.displayName = 'ApplicationRoutes';
