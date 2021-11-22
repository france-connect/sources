/* istanbul ignore file */

// declarative file
import { ConfigInterface } from './config.interface';
import { UserInterface } from './user.interface';

export interface AppContextStateInterface {
  config: ConfigInterface;
  user: UserInterface;
  [key: string]: any;
}

export interface AppContextInterface {
  state: AppContextStateInterface;
  update: Function;
}
