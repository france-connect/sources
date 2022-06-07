/* istanbul ignore file */

// declarative file
import { AccountData } from './account-data.interface';

export interface AccountInterface {
  connected: boolean;
  ready: boolean;
  userinfos: AccountData | undefined;
  updateAccount: Function;
}
