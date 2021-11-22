import { registerRoutes, HOMEPAGE_PATH, NOTFOUND_PATH } from '@fc/routing';
import NotFoundPage from '../ui/pages/not-found/not-found.page';
import ErrorPage from '../ui/pages/error/error.page';
import Homepage from '../ui/pages/home-page/home.page';
import { TracksPage } from '../ui/pages/tracks/tracks.page';

export const routes = registerRoutes([
  { path: NOTFOUND_PATH, component: NotFoundPage },
  { path: HOMEPAGE_PATH, component: Homepage },
  {
    path: '/history',
    component: TracksPage,
    label: 'User Dashboard - Traces',
    order: 2,
  },
  {
    path: '/error',
    component: ErrorPage,
    label: 'User Dashboard - Erreur',
    order: 2,
  },
]);
