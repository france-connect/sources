/* istanbul ignore file */

// declarative file
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ApplicationLayout } from '@fc/dsfr';

import { ErrorPage, HomePage } from './pages';

export const ApplicationRoutes = React.memo(() => (
  <Routes>
    <Route element={<ApplicationLayout />} path="/">
      <Route element={<HomePage />} path="api/v2/interaction/:uid" />
      <Route element={<ErrorPage />} path="*" />
    </Route>
  </Routes>
));

ApplicationRoutes.displayName = 'ApplicationRoutes';
