import { NavigationItem } from '@fc/routing';

import {
  filterRouteHasOrderProperty,
  sortNavigationRouteByOrder,
} from './utils';

const routes = [
  {
    // eslint-disable-next-line react/display-name
    component: () => <div />,
    id: 'mock-mock-id',
    label: 'mock',
    order: 1,
    path: '/mock/:id',
    exact: false,
  },
  {
    // eslint-disable-next-line react/display-name
    component: () => <div />,
    id: 'mock-joker',
    path: '/*',
  },
  {
    // eslint-disable-next-line react/display-name
    component: () => <div />,
    id: 'mock-mock',
    label: 'mock',
    order: 0,
    path: '/mock',
  },
  {
    // eslint-disable-next-line react/display-name
    component: () => <div />,
    id: 'mock-home',
    path: '/',
  },
] as Required<NavigationItem>[];

describe('filterRouteHasOrderProperty', () => {
  it('should return true if route has an order property', () => {
    // when
    const result = filterRouteHasOrderProperty(routes[0]);
    // then
    expect(result).toBeTruthy();
  });

  it('should return false if route nas no order property', () => {
    // when
    const result = filterRouteHasOrderProperty(routes[1]);
    // then
    expect(result).toBeFalsy();
  });

  it('should filter routes without an order property', () => {
    // when
    const results = routes.filter(filterRouteHasOrderProperty);
    // then
    expect(results).toHaveLength(2);
    expect(results).toStrictEqual([routes[0], routes[2]]);
  });
});

describe('sortNavigationRouteByOrder', () => {
  it('should return the diff number between two order property', () => {
    // when
    const results = sortNavigationRouteByOrder(routes[0], routes[2]);
    // then
    expect(results).toStrictEqual(1);
  });

  it('should return routes sorted by order property', () => {
    // when
    const results = [routes[0], routes[2]].sort(sortNavigationRouteByOrder);
    // then
    expect(results).toHaveLength(2);
    expect(results[0].order).toStrictEqual(0);
    expect(results[1].order).toStrictEqual(1);
  });
});
