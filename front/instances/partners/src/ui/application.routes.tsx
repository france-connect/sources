import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { InstancesService, VersionsService } from '@fc/core-partners';
import { ApplicationLayout } from '@fc/layout';
import { AuthedRoute, RouterErrorBoundaryComponent, UnauthedRoute } from '@fc/routing';

import { RouteLoaderDataIds } from '../enums';
import { PageLayout } from './layouts';
import {
  HomePage,
  InstanceCreatePage,
  InstancesPage,
  InstanceUpdatePage,
  LoginPage,
} from './pages';

export const ApplicationRoutes = React.memo(() => {
  const routes = createRoutesFromElements(
    <Route element={<ApplicationLayout />} errorElement={<RouterErrorBoundaryComponent />} path="/">
      <Route element={<UnauthedRoute fallback="/instances" />}>
        <Route element={<LoginPage />} path="login" />
      </Route>
      <Route element={<AuthedRoute fallback="/login" />}>
        <Route element={<PageLayout />}>
          <Route
            id={RouteLoaderDataIds.VERSION_SCHEMA}
            loader={VersionsService.loadSchema}
            path="instances">
            <Route element={<InstanceCreatePage />} path="create" />
            <Route
              element={<InstanceUpdatePage />}
              loader={InstancesService.read}
              path=":instanceId"
            />
            <Route index element={<InstancesPage />} loader={InstancesService.loadAll} />
          </Route>
        </Route>
        <Route index element={<HomePage />} />
      </Route>
    </Route>,
  );

  const appRouter = createBrowserRouter(routes, {
    basename: '/',
  });

  return <RouterProvider router={appRouter} />;
});

ApplicationRoutes.displayName = 'ApplicationRoutes';
