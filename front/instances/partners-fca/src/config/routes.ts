/* istanbul ignore file */

// declarative file
import { ServiceProvidersPage } from '@fc/partners';
import { HOMEPAGE_PATH, NOTFOUND_PATH, registerRoutes } from '@fc/routing';

import { ErrorPage, HomePage, LoginPage, NotFoundPage } from '../ui/pages';

export const routes = registerRoutes([
  { component: NotFoundPage, path: NOTFOUND_PATH },
  { component: HomePage, path: HOMEPAGE_PATH },
  { component: ServiceProvidersPage, path: '/service-providers' },
  { component: LoginPage, path: '/login' },
  {
    component: ErrorPage,
    label: 'Partenaires Agent Connect - Erreur',
    order: 2,
    path: '/error',
  },
]);
