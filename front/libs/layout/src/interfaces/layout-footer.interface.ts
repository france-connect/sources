import type { NavigationLinkInterface } from '@fc/common';

export interface LayoutFooterInterface {
  links: NavigationLinkInterface[];
  description?: string;
  navigation: NavigationLinkInterface[];
}
