import type { ButtonHTMLAttributes } from 'react';

import type { IconPlacement, Priorities, Sizes } from '../enums';

export interface ButtonInterface
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'title' | 'disabled' | 'onClick'> {
  children: React.ReactNode;
  dataTestId?: string;
  size?: Sizes;
  priority?: Priorities;
  noOutline?: boolean;
  icon?: string;
  iconPlacement?: IconPlacement;
}
