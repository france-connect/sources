import type { Location } from 'react-router';

export interface AuthRouteInterface {
  replace?: boolean;
  fallback?: string | ((location: Location) => string);
}
