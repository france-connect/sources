import { NavigationItem } from '@fc/routing';

export const filterRouteHasOrderProperty = (
  route: NavigationItem,
): route is Required<NavigationItem> => {
  if (route.order === undefined) return false;
  return route.order >= 0;
};

export const sortNavigationRouteByOrder = (
  a: Required<NavigationItem>,
  b: Required<NavigationItem>,
): number => a.order - b.order;
