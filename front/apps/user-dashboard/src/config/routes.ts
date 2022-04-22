/* istanbul ignore file */

// declarative file
import {
  AuthedRouteComponent,
  HOMEPAGE_PATH,
  NOTFOUND_PATH,
  registerRoutes,
  UnauthedRouteComponent,
} from '@fc/routing';

import { ErrorPage, HomePage, NotFoundPage, TracksPage, UserPreferencesPage } from '../ui/pages';

export const routes = registerRoutes([
  { component: NotFoundPage, path: NOTFOUND_PATH },
  {
    component: HomePage,
    path: HOMEPAGE_PATH,
    routing: { authRedirect: '/history', authWrapper: UnauthedRouteComponent },
  },
  {
    component: TracksPage,
    label: 'User Dashboard - Traces',
    order: 2,
    path: '/history',
    routing: { authRedirect: '/', authWrapper: AuthedRouteComponent },
  },
  {
    component: UserPreferencesPage,
    label: 'User Dashboard - Mes Accès',
    order: 2,
    path: '/preferences',
    routing: { authRedirect: '/', authWrapper: AuthedRouteComponent },
  },
  {
    component: ErrorPage,
    label: 'User Dashboard - Erreur',
    order: 2,
    path: '/error',
  },
]);
