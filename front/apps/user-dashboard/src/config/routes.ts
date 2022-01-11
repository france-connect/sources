/* istanbul ignore file */

// declarative file
import { HOMEPAGE_PATH, NOTFOUND_PATH, registerRoutes } from '@fc/routing';

import { ErrorPage } from '../ui/pages/error/error.page';
import { HomePage } from '../ui/pages/home-page/home.page';
import { NotFoundPage } from '../ui/pages/not-found/not-found.page';
import { TracksPage } from '../ui/pages/tracks/tracks.page';

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
    component: ErrorPage,
    label: 'User Dashboard - Erreur',
    order: 2,
    path: '/error',
  },
]);
