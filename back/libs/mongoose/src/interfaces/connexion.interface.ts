import { Connection } from 'mongoose';

export type NestJsConnection = Connection & {
  $initialConnection: Promise<unknown>;
};
