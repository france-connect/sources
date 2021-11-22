import { RouteItem } from '@fc/routing';

export interface LayoutConfig {
  /**
   * @todo find the proper way to declare react components in interfaces
   */
  logo: any;
  returnButton?: any;
  bottomLinks: any[];
  footerDescription: string;
  footerLinkTitle: string;
}

export interface ApplicationLayoutProps {
  routes: RouteItem[];
  config: LayoutConfig;
}
