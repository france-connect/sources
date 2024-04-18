/* istanbul ignore file */

// declarative file
import type { FunctionComponent } from 'react';

import type { NavigationOptions } from './navigation-options.interface';

export interface NavigationItem extends NavigationOptions {
  component: FunctionComponent;
  id?: string;
  path: string;
}
