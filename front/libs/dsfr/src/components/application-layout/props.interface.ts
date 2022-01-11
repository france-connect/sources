import { RouteItem } from '@fc/routing';

export interface LayoutConfig {
  // @todo find the proper way to declare react components in interfaces
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo: any;
  // @todo find the proper way to declare react components in interfaces
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  returnButton?: any;
  bottomLinks: NavigationLink[];
  footerDescription: string;
  footerLinkTitle: string;
}

export interface ApplicationLayoutProps {
  routes: RouteItem[];
  config: LayoutConfig;
}

export interface NavigationLink {
  a11y: string;
  href: string;
  label: string;
}
