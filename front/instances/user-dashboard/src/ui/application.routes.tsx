import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router';

import { useSafeContext } from '@fc/common';
import { authedFallback, unauthedFallback } from '@fc/core-user-dashboard';
import type { Dto2FormServiceContextInterface } from '@fc/dto2form-service';
import { Dto2FormServiceContext } from '@fc/dto2form-service';
import { ApplicationLayout } from '@fc/layout';
import { AuthedRoute, RouterErrorBoundaryComponent, UnauthedRoute } from '@fc/routing';

import { loadFraudTracks } from '../loaders';
import { IdentityTheftReportLayout, StepperLayout } from './layouts';
import {
  Error409Component,
  ErrorGenericComponent,
  ErrorPage,
  FraudFormPage,
  FraudLoginPage,
  HomePage,
  IdentityTheftReportAuthenticationEventIdPage,
  IdentityTheftReportConnectionListPage,
  IdentityTheftReportContactPage,
  IdentityTheftReportDescriptionUsurpationPage,
  IdentityTheftReportIdentityPage,
  IdentityTheftReportSuccessPage,
  IdentityTheftReportSummaryPage,
  LegalNoticesPage,
  NotFoundPage,
  TracksPage,
  UserPreferencesPage,
} from './pages';

export const ApplicationRoutes = React.memo(() => {
  const { loadData } = useSafeContext<Dto2FormServiceContextInterface>(Dto2FormServiceContext);

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
      <Route element={<IdentityTheftReportLayout />} path="signalement-usurpation">
        <Route element={<IdentityTheftReportSuccessPage />} path="success" />
        <Route element={<StepperLayout />}>
          <Route
            element={<IdentityTheftReportSummaryPage />}
            loader={loadData('IdentityTheftSummary')}
            path="recapitulatif"
          />
          <Route
            element={<IdentityTheftReportContactPage />}
            loader={loadData('IdentityTheftContact')}
            path="contact"
          />
          <Route
            element={<IdentityTheftReportIdentityPage />}
            loader={loadData('IdentityTheftIdentity')}
            path="identite-usurpee"
          />
          <Route
            element={<IdentityTheftReportConnectionListPage />}
            loader={loadFraudTracks}
            path="connexions-existantes"
          />
          <Route
            element={<IdentityTheftReportAuthenticationEventIdPage />}
            loader={loadData('IdentityTheftConnection')}
            path="code-identification"
          />
          <Route
            element={<IdentityTheftReportDescriptionUsurpationPage />}
            loader={loadData('IdentityTheftDescription')}
            path="description-usurpation"
          />
        </Route>
        <Route index element={<Navigate to="description-usurpation" />} />
      </Route>
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
