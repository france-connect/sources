import type { ButtonHTMLAttributes } from 'react';

import type { ButtonTypes, IconPlacement, Priorities, Sizes } from '../enums';

export interface ButtonInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
  dataTestId?: string;
  size?: Sizes;
  priority?: Priorities;
  noOutline?: boolean;
  icon?: string;
  type?: ButtonTypes | undefined;
  iconPlacement?: IconPlacement;
}
