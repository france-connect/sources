/* istanbul ignore file */

// declarative file
import { HOMEPAGE_PATH, NOTFOUND_PATH, registerRoutes } from '@fc/routing';

import { ErrorPage, HomePage, NotFoundPage, TracksPage, UserPreferencesPage } from '../ui/pages';

export const routes = registerRoutes([
  { component: NotFoundPage, path: NOTFOUND_PATH },
  { component: HomePage, path: HOMEPAGE_PATH },
  {
    component: TracksPage,
    label: 'User Dashboard - Traces',
    order: 2,
    path: '/history',
  },
  {
    component: UserPreferencesPage,
    label: 'User Dashboard - Mes Accès',
    order: 2,
    path: '/preferences',
  },
  {
    component: ErrorPage,
    label: 'User Dashboard - Erreur',
    order: 2,
    path: '/error',
  },
]);
