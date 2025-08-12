import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router';

import { ConfigService } from '@fc/config';
import { authedFallback, unauthedFallback } from '@fc/core-user-dashboard';
import type { Dto2FormConfigInterface } from '@fc/dto2form';
import { loadData, loadSchema } from '@fc/dto2form';
import { ApplicationLayout } from '@fc/layout';
import { AuthedRoute, RouterErrorBoundaryComponent, UnauthedRoute } from '@fc/routing';

import { IdentityTheftReportLayout, StepperLayout } from './layouts';
import {
  Error409Component,
  ErrorGenericComponent,
  ErrorPage,
  FraudFormPage,
  FraudLoginPage,
  HomePage,
  IdentityTheftReportAuthenticationEventIdPage,
  IdentityTheftReportContactPage,
  IdentityTheftReportDescriptionUsurpationPage,
  IdentityTheftReportPivotIdentityPage,
  IdentityTheftReportSuccessPage,
  IdentityTheftReportSummaryPage,
  LegalNoticesPage,
  NotFoundPage,
  TracksPage,
  UserPreferencesPage,
} from './pages';

export const ApplicationRoutes = React.memo(() => {
  const forms = ConfigService.get<Dto2FormConfigInterface>('Dto2Form');

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
            loader={loadData(forms.IdentityTheftSummary.endpoints.schema.path)}
            path="recapitulatif"
          />
          <Route
            element={<IdentityTheftReportContactPage />}
            id={forms.IdentityTheftContact.endpoints.schema.path}
            loader={loadSchema(forms.IdentityTheftContact.endpoints.schema.path)}
            path="contact"
          />
          <Route
            element={<IdentityTheftReportPivotIdentityPage />}
            id={forms.IdentityTheftIdentity.endpoints.schema.path}
            loader={loadSchema(forms.IdentityTheftIdentity.endpoints.schema.path)}
            path="identite-usurpee"
          />
          <Route
            element={<IdentityTheftReportAuthenticationEventIdPage />}
            id={forms.IdentityTheftConnection.endpoints.schema.path}
            loader={loadSchema(forms.IdentityTheftConnection.endpoints.schema.path)}
            path="code-identification"
          />
          <Route
            element={<IdentityTheftReportDescriptionUsurpationPage />}
            id={forms.IdentityTheftDescription.endpoints.schema.path}
            loader={loadSchema(forms.IdentityTheftDescription.endpoints.schema.path)}
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
