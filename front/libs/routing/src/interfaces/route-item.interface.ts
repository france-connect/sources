/* istanbul ignore file */

// declarative file
import { RouteProps } from 'react-router-dom';

import { NavigationItem } from './navigation-item.interface';

// @NOTE can not be translated into `interface`
// NavigationItem and RouteProps `component` prop overlapping
export type RouteItem = NavigationItem &
  RouteProps & {
    routing?: {
      authWrapper: React.ElementType;
      authRedirect: string;
    };
  };
