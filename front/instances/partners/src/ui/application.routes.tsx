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

export const ApplicationRoutes = React.memo(() => {
  const appRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<ApplicationLayout />} path="/">
        <Route element={<UnauthedRoute />}>
          <Route element={<LoginPage />} path="login" />
        </Route>
        <Route element={<AuthedRoute fallback="/login" />}>
          <Route index element={<HomePage />} />
        </Route>
      </Route>,
    ),
  );
  return <RouterProvider router={appRouter} />;
});

ApplicationRoutes.displayName = 'ApplicationRoutes';
