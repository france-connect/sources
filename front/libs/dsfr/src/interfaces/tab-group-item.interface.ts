import type { PropsWithClassName } from '@fc/common';

export interface TabGroupItemInterface extends PropsWithClassName {
  id: string;
  label: string;
  element: React.ReactElement;
}
