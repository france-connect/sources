/* istanbul ignore file */

// declarative file
import { HOMEPAGE_PATH, NOTFOUND_PATH, registerRoutes } from '@fc/routing';

import { ErrorPage, HomePage, NotFoundPage } from '../ui/pages';

export const routes = registerRoutes([
  { component: NotFoundPage, path: NOTFOUND_PATH },
  { component: HomePage, path: HOMEPAGE_PATH },
  {
    component: ErrorPage,
    label: 'Partenaires FC - Erreur',
    order: 2,
    path: '/error',
  },
]);
