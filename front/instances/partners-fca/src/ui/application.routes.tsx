/* istanbul ignore file */

// declarative file
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ApplicationLayout } from '@fc/dsfr';
import {
  ServiceProvidersDetailsEditPage,
  ServiceProvidersDetailsViewPage,
  ServiceProvidersPage,
} from '@fc/partners';

import { ErrorPage, HomePage, LoginPage, NotFoundPage } from './pages';

export const ApplicationRoutes = React.memo(() => (
  <Routes>
    <Route element={<ApplicationLayout />} path="/">
      <Route index element={<HomePage />} />
      <Route element={<LoginPage />} path="login" />
      <Route element={<ErrorPage />} path="error" />
      <Route path="service-providers">
        <Route index element={<ServiceProvidersPage />} />
        <Route path=":id">
          <Route element={<ServiceProvidersDetailsEditPage />} path="edit" />
          <Route element={<ServiceProvidersDetailsViewPage />} path="view" />
        </Route>
      </Route>
      <Route element={<NotFoundPage />} path="*" />
    </Route>
  </Routes>
));

ApplicationRoutes.displayName = 'ApplicationRoutes';
