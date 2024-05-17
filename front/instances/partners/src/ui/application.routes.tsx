/* istanbul ignore file */

// declarative file
import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { ApplicationLayout } from '@fc/dsfr';

import { HomePage } from './pages';

export const ApplicationRoutes = React.memo(() => {
  const appRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<ApplicationLayout />} path="/">
        <Route index element={<HomePage />} />
      </Route>,
    ),
  );
  return <RouterProvider router={appRouter} />;
});

ApplicationRoutes.displayName = 'ApplicationRoutes';
