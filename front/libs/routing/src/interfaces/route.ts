/* istanbul ignore file */

// declarative file
import { FunctionComponent } from 'react';
import { RouteProps } from 'react-router-dom';

export type RoutePath = string;

export type RouteMap = {
  [key: string]: RoutePath;
};

export type NavigationOptions = {
  order?: number;
  label?: string;
  exact?: boolean;
};

export type NavigationItem = NavigationOptions & {
  component: FunctionComponent;
  id?: string;
  path: RoutePath;
};

export type RouteItem = NavigationItem & RouteProps;
