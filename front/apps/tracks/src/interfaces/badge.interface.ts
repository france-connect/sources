/* istanbul ignore file */

// declarative file
import type { IconType } from 'react-icons';

export interface Badge {
  colorName: string;
  Icon: IconType;
  label: string;
}

export interface Badges {
  [key: string]: Badge;
}
