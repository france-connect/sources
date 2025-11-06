import type { PropsWithChildren } from 'react';

import type { PropsWithClassName } from '@fc/common';

import type { IconPlacement, Sizes } from '../enums';

export interface LinkInterface extends PropsWithChildren, PropsWithClassName {
  href: string;
  icon?: string;
  iconPlacement?: IconPlacement;
  size?: Sizes;
  label?: string | undefined;
  title?: string;
  dataTestId?: string;
}
