import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { MagnifierArtworkComponent } from '@fc/assets';
import { NotFoundComponent } from '@fc/exceptions';
import { RouterErrorBoundaryComponent } from '@fc/routing';

import { loadStatus } from '../loaders';
import { ApplicationLayout } from './layouts';
import { HomePage } from './pages';

export const ApplicationRoutes = React.memo(() => {
  const routes = createRoutesFromElements(
    <Route element={<ApplicationLayout />} errorElement={<RouterErrorBoundaryComponent />} path="/">
      <Route index element={<HomePage />} loader={loadStatus} />
      <Route element={<NotFoundComponent artwork={<MagnifierArtworkComponent />} />} path="*" />
    </Route>,
  );

  const appRouter = createBrowserRouter(routes, {
    basename: '/',
  });

  return <RouterProvider router={appRouter} />;
});

ApplicationRoutes.displayName = 'ApplicationRoutes';
