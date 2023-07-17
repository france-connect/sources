import { platform } from '../enums';

export interface MongoRequestFilterArgument {
  active: boolean;
  platform?: platform;
}
