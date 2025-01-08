import type { AccountConfig } from '@fc/account';

export const Account: AccountConfig = {
  endpoints: {
    login: '/api/redirect-to-idp',
    logout: '/api/logout',
    me: '/api/me',
  },
};
