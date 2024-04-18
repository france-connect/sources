/* istanbul ignore file */

// declarative file
import type { AccountData } from './account-data.interface';

export interface AccountInterface<U = AccountData> {
  connected: boolean;
  ready: boolean;
  userinfos: U | undefined;
  updateAccount: Function;
}
