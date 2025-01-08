import { LogLevels } from '../enums';

export type CustomLogLevels = {
  [key in LogLevels]: number;
};
