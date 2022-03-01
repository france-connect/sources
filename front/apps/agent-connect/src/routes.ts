/* istanbul ignore file */

// declarative file
import { HomePage } from './pages/homepage';
import { ErrorPage } from './pages/error';

export const routes = [
  {
    component: HomePage,
    exact: true,
    id: 'homepage',
    path: '/api/v2/interaction/:uid',
    title: 'AgentConnect',
  },
  {
    component: ErrorPage,
    exact: true,
    id: 'error',
    path: '*',
    title: 'Error',
  },
];
