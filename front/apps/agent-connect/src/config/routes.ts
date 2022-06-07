/* istanbul ignore file */

// declarative file
import { ErrorPage, HomePage } from '../ui/pages';

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
