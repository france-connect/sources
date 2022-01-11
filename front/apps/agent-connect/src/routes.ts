/* istanbul ignore file */

// declarative file
import { ErrorPage } from './pages/error.page';
import { HomePage } from './pages/homepage';
import { NotFoundPage } from './pages/not-found.page';

export const routes = [
  {
    component: ErrorPage,
    exact: true,
    id: 'error-page',
    path: '/api/v2/error',
    title: "Erreur lors de l'authentification",
  },
  {
    component: HomePage,
    exact: true,
    id: 'homepage',
    path: '/api/v2/interaction/:uid',
    title: '',
  },
  {
    component: NotFoundPage,
    exact: true,
    id: 'homepage',
    path: '*',
    title: '404',
  },
];
