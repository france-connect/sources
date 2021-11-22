/* istanbul ignore file */

// declarative file
import { HOMEPAGE_PATH, NOTFOUND_PATH } from './constants';

export const notfound = {
  // eslint-disable-next-line react/display-name
  component: () => <div />,
  id: 'mock-notfound',
  label: 'mock-notfound',
  order: 1,
  path: NOTFOUND_PATH,
};

export const homepage = {
  // eslint-disable-next-line react/display-name
  component: () => <div />,
  id: 'mock-homepage',
  label: 'mock-homepage',
  order: 1,
  path: HOMEPAGE_PATH,
};

export const generics = [
  {
    // eslint-disable-next-line react/display-name
    component: () => <div />,
    id: 'mock-id',
    label: 'mock',
    order: 1,
    path: '/mock/:id',
  },
  {
    // eslint-disable-next-line react/display-name
    component: () => <div />,
    id: 'mock',
    path: '/mock',
  },
  {
    // eslint-disable-next-line react/display-name
    component: () => <div />,
    id: 'mock-id-sub',
    path: '/mock/:id/sub',
  },
  {
    // eslint-disable-next-line react/display-name
    component: () => <div />,
    id: 'contact',
    path: '/contact',
  },
  {
    // eslint-disable-next-line react/display-name
    component: () => <div />,
    id: 'mock-sub-id',
    path: '/mock/sub/:id',
  },
];
