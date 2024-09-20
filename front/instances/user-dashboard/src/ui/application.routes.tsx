/* istanbul ignore file */

// declarative file
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ApplicationLayout } from '@fc/layout';
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

enum AUTH_FALLBACK_ROUTES {
  INDEX = '/',
  HISTORY = '/history',
}

export const ApplicationRoutes = React.memo(() => (
  <Routes>
    <Route element={<ApplicationLayout />} path="/">
      <Route element={<AuthedRoute fallback={AUTH_FALLBACK_ROUTES.INDEX} />}>
        <Route element={<TracksPage />} path="history" />
        <Route element={<UserPreferencesPage />} path="preferences" />
      </Route>
      <Route element={<UnauthedRoute fallback={AUTH_FALLBACK_ROUTES.HISTORY} />}>
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
