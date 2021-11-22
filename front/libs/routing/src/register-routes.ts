import { RouteItem } from './interfaces';
import { HOMEPAGE_PATH, NOTFOUND_PATH } from './constants';
import { MissingSpecialRouteException } from './exceptions';

const mandatoryRoutes = [HOMEPAGE_PATH, NOTFOUND_PATH];

/**
 * Throw if we miss homepage or 404 pages
 */
export const validateSpecialRoutes = (routes: RouteItem[]) => {
  const [{ path: homePath }, { path: notFoundPath }] = routes;

  if (homePath !== HOMEPAGE_PATH) {
    throw new MissingSpecialRouteException('home page');
  }

  if (notFoundPath !== NOTFOUND_PATH) {
    throw new MissingSpecialRouteException('not found');
  }
};

/**
 * Sort routes on path in order for matching engine to work as expected
 */
export const sortRouteByPathDesc = (a: RouteItem, b: RouteItem): number => {
  if (a.path < b.path) return 1;
  if (a.path > b.path) return -1;
  return 0;
};

/**
 * Binds an id to pages, usefull for debug
 */
export const bindPageId = (page: RouteItem) => ({
  ...page,
  id: page.component.displayName,
});

/**
 * Build the validated, binded, and sorted list of routes
 */
export const registerRoutes = (pages: RouteItem[]): RouteItem[] => {
  // Extract special routes from list
  const specialRoutes = pages
    .filter(({ path }) => mandatoryRoutes.includes(path))
    .sort(sortRouteByPathDesc)
    .reverse(); // Not found must be the last one

  // Check we have needed routes
  validateSpecialRoutes(specialRoutes);

  // Sort other routes
  const normalRoutes = pages
    .filter(({ path }) => !mandatoryRoutes.includes(path))
    .sort(sortRouteByPathDesc);

  // Build the final list                  Bind id for debug purpose
  const result = [...normalRoutes, ...specialRoutes].map(bindPageId);

  return result;
};
