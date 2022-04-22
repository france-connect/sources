/* istanbul ignore file */

// declarative file
import { UserinfosInterface } from './userinfos.interface';

export interface UserInterface {
  connected: boolean;
  ready: boolean;
  userinfos: UserinfosInterface | undefined;
}
