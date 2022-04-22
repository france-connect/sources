/* istanbul ignore file */

// declarative file
import { FunctionComponent } from 'react';

import { NavigationOptions } from './navigation-options.interface';

export interface NavigationItem extends NavigationOptions {
  component: FunctionComponent;
  id?: string;
  path: string;
}
