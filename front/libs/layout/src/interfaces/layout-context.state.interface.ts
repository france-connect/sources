/* istanbul ignore file */

// declarative file
import type { MouseEventHandler } from 'react';

import type { UserInfosInterface } from '@fc/account';

export interface LayoutContextState {
  menuIsOpened: boolean;
  isUserConnected: boolean;
  userinfos: UserInfosInterface | undefined;
  toggleMenu: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}
