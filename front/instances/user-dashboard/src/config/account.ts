/* istanbul ignore file */

// declarative file
import type { AccountConfig } from '@fc/account';

export const Account: AccountConfig = {
  endpoints: {
    login: '/api/login',
    logout: '/api/logout',
    me: '/api/me',
  },
};
