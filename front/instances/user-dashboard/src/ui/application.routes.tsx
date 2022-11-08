/* istanbul ignore file */

// declarative file
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ApplicationLayout } from '@fc/dsfr';
import { AuthedRoute, UnauthedRoute } from '@fc/routing';

import {
  Error409Component,
  ErrorGenericComponent,
  ErrorPage,
  HomePage,
  NotFoundPage,
  TracksPage,
  UserPreferencesPage,
} from './pages';

export const ApplicationRoutes = React.memo(() => (
  <Routes>
    <Route element={<ApplicationLayout />} path="/">
      <Route element={<AuthedRoute fallbackPath="/" />}>
        <Route element={<TracksPage />} path="history" />
        <Route element={<UserPreferencesPage />} path="preferences" />
      </Route>
      <Route element={<UnauthedRoute fallbackPath="/history" />}>
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
