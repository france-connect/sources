import type { NavigationLinkInterface } from '@fc/common';

import type { LayoutFeaturesInterface } from './layout-features.interface';
import type { LayoutFooterInterface } from './layout-footer.interface';
import type { LayoutServiceInterface } from './layout-service.interface';

export interface LayoutConfig {
  navigation?: NavigationLinkInterface[];
  service: LayoutServiceInterface;
  footer: LayoutFooterInterface;
  features: LayoutFeaturesInterface;
  sitemap?: NavigationLinkInterface[];
}
