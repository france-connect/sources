import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';

import { useSafeContext } from '@fc/common';
import { PartnersService } from '@fc/core-partners';
import type { Dto2FormServiceContextInterface } from '@fc/dto2form-service';
import { Dto2FormServiceContext } from '@fc/dto2form-service';
import { ApplicationLayout } from '@fc/layout';
import { AuthedRoute, RouterErrorBoundaryComponent, UnauthedRoute } from '@fc/routing';

import { PageLayout } from './layouts';
import {
  HomePage,
  InstanceCreatePage,
  InstancesPage,
  InstanceUpdatePage,
  LegalNoticesPage,
  LoginPage,
  ServiceProviderCreateInstancePage,
  ServiceProviderErrorPage,
  ServiceProviderLinkInstancesPage,
  ServiceProviderPage,
  ServiceProvidersPage,
  SitemapPage,
} from './pages';

export const ApplicationRoutes = React.memo(() => {
  const { getConfigFormById, loadData } =
    useSafeContext<Dto2FormServiceContextInterface>(Dto2FormServiceContext);

  const routes = createRoutesFromElements(
    <Route element={<ApplicationLayout />} errorElement={<RouterErrorBoundaryComponent />} path="/">
      <Route element={<UnauthedRoute fallback="/" />}>
        <Route element={<LoginPage />} path="login" />
      </Route>
      <Route element={<AuthedRoute fallback="/login" />}>
        <Route element={<PageLayout />}>
          <Route path="fournisseurs-de-service">
            <Route
              errorElement={<ServiceProviderErrorPage />}
              id="service-provider"
              loader={PartnersService.loadServiceProviderById}
              path=":serviceProviderId">
              <Route
                element={<ServiceProviderLinkInstancesPage />}
                loader={PartnersService.loadLinkableInstancesByServiceProviderId}
                path="link-instances"
              />
              <Route
                element={<ServiceProviderCreateInstancePage />}
                id={getConfigFormById('ServiceProviderCreateInstance').id}
                loader={loadData('ServiceProviderCreateInstance')}
                path="creer-instance"
              />
              <Route
                index
                element={<ServiceProviderPage />}
                loader={PartnersService.loadLinkableInstancesByServiceProviderId}
              />
            </Route>
            <Route
              index
              element={<ServiceProvidersPage />}
              loader={PartnersService.loadAllServiceProviders}
            />
          </Route>
          <Route path="instances">
            <Route
              element={<InstanceCreatePage />}
              id={getConfigFormById('InstancesCreate').id}
              loader={loadData('InstancesCreate')}
              path="creer-instance"
            />
            <Route
              element={<InstanceUpdatePage />}
              id={getConfigFormById('InstancesUpdate').id}
              loader={loadData('InstancesUpdate')}
              path=":instanceId"
            />
            <Route index element={<InstancesPage />} loader={PartnersService.loadAllInstances} />
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
