/* istanbul ignore file */

// declarative file
import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { ApplicationLayout } from '@fc/layout';
import { AuthedRoute, UnauthedRoute } from '@fc/routing';

import { HomePage, LoginPage } from './pages';
import { Step1Page, Step2Page, Step3Page, Step4Page, Step5Page } from './pages/steps';

export const ApplicationRoutes = React.memo(() => {
  const appRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<ApplicationLayout />} path="/">
        <Route element={<UnauthedRoute />}>
          <Route element={<LoginPage />} path="login" />
        </Route>
        <Route element={<AuthedRoute fallback="/login" />}>
          <Route index element={<HomePage />} />
          <Route path="mock/steps">
            <Route element={<Step5Page />} path="step-5" />
            <Route element={<Step4Page />} path="step-4" />
            <Route element={<Step3Page />} path="step-3" />
            <Route element={<Step2Page />} path="step-2" />
            <Route index element={<Step1Page />} path="*" />
          </Route>
        </Route>
      </Route>,
    ),
  );
  return <RouterProvider router={appRouter} />;
});

ApplicationRoutes.displayName = 'ApplicationRoutes';
