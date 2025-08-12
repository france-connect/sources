import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';

import { ConfigService } from '@fc/config';
import { type Dto2FormConfigInterface, loadSchema } from '@fc/dto2form';
import { ApplicationLayout } from '@fc/layout';
import { AuthedRoute, RouterErrorBoundaryComponent, UnauthedRoute } from '@fc/routing';

import { loadVersion } from '../helpers';
import { InstancesService } from '../services';
import { PageLayout } from './layouts';
import {
  HomePage,
  InstanceCreatePage,
  InstancesPage,
  InstanceUpdatePage,
  LegalNoticesPage,
  LoginPage,
  SitemapPage,
} from './pages';

export const ApplicationRoutes = React.memo(() => {
  const forms = ConfigService.get<Dto2FormConfigInterface>('Dto2Form');

  const routes = createRoutesFromElements(
    <Route element={<ApplicationLayout />} errorElement={<RouterErrorBoundaryComponent />} path="/">
      <Route element={<UnauthedRoute fallback="/instances" />}>
        <Route element={<LoginPage />} path="login" />
      </Route>
      <Route element={<AuthedRoute fallback="/login" />}>
        <Route element={<PageLayout />}>
          <Route
            id={forms.InstancesCreate.endpoints.schema.path}
            loader={loadSchema(forms.InstancesCreate.endpoints.schema.path)}
            path="instances">
            <Route element={<InstanceCreatePage />} path="create" />
            <Route
              element={<InstanceUpdatePage />}
              id={forms.InstancesUpdate.endpoints.load?.path}
              loader={loadVersion(forms.InstancesUpdate.endpoints.load?.path as string)}
              path=":instanceId"
            />
            <Route index element={<InstancesPage />} loader={InstancesService.loadAll} />
          </Route>
        </Route>
        <Route index element={<HomePage />} />
      </Route>
      <Route element={<PageLayout />}>
        <Route element={<LegalNoticesPage />} path="mentions-legales" />
        <Route element={<SitemapPage />} path="plan-du-site" />
      </Route>
    </Route>,
  );

  const appRouter = createBrowserRouter(routes, {
    basename: '/',
  });

  return <RouterProvider router={appRouter} />;
});

ApplicationRoutes.displayName = 'ApplicationRoutes';
