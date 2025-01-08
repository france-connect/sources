import type { IconType } from 'react-icons';

import type { Sizes } from '../enums';

export interface BadgeInterface {
  colorName?: string | undefined;
  Icon?: IconType | undefined;
  label: string;
  size?: Sizes | undefined;
  iconSize?: number | undefined;
}
