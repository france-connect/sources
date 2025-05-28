import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';

import { ApplicationLayout } from '@fc/layout';
import { AuthedRoute, RouterErrorBoundaryComponent, UnauthedRoute } from '@fc/routing';
import { authedFallback, unauthedFallback } from '@fc/user-dashboard';

import {
  Error409Component,
  ErrorGenericComponent,
  ErrorPage,
  HomePage,
  IdentityTheftReportPage,
  LegalNoticesPage,
  NotFoundPage,
  TracksPage,
  UserPreferencesPage,
} from './pages';
import { FraudFormPage } from './pages/fraud-form';
import { FraudLoginPage } from './pages/fraud-login';

export const ApplicationRoutes = React.memo(() => {
  const routes = createRoutesFromElements(
    <Route element={<ApplicationLayout />} errorElement={<RouterErrorBoundaryComponent />} path="/">
      <Route element={<AuthedRoute fallback={authedFallback} />}>
        <Route element={<TracksPage />} path="history" />
        <Route element={<UserPreferencesPage />} path="preferences" />
        <Route element={<FraudFormPage />} path="fraud/form" />
      </Route>
      <Route element={<UnauthedRoute fallback={unauthedFallback} />}>
        <Route element={<FraudLoginPage />} path="fraud" />
        <Route index element={<HomePage />} />
      </Route>
      <Route element={<IdentityTheftReportPage />} path="signalement-usurpation" />
      <Route element={<ErrorPage />} path="error">
        <Route index element={<ErrorGenericComponent />} />
        <Route element={<Error409Component />} path="409" />
      </Route>
      <Route element={<LegalNoticesPage />} path="/mentions-legales" />
      <Route element={<NotFoundPage />} path="*" />
    </Route>,
  );

  const appRouter = createBrowserRouter(routes, {
    basename: '/',
  });

  return <RouterProvider router={appRouter} />;
});

ApplicationRoutes.displayName = 'ApplicationRoutes';
