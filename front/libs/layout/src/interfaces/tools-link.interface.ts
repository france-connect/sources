import type { LinkInterface } from '@fc/dsfr';

export interface ToolsLinkInterface extends LinkInterface {
  external?: boolean;
  onlyIfConnected?: boolean;
}
