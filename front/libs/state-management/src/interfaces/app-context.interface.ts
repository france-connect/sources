/* istanbul ignore file */

// declarative file
import type { ConfigInterface } from './config.interface';
import type { UserInterface } from './user.interface';

export interface AppContextStateInterface {
  config: ConfigInterface;
  user: UserInterface;
  [key: string]: unknown;
}

export interface AppContextInterface {
  state: AppContextStateInterface;
  update: Function;
}
