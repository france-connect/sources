import type { NavigationLinkInterface } from '@fc/common';

import type { ToolsLinkInterface } from './tools-link.interface';

export interface LayoutHeaderInterface {
  navigation?: NavigationLinkInterface[];
  toolsLinks?: ToolsLinkInterface[];
}
