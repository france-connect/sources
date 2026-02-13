import { TransformStatesEnum } from '../enums';

export interface TransformStatusInterface {
  id: string;
  state: TransformStatesEnum;
  lastCheckpoint?: number;
  docsIndexed?: number;
  reason?: string;
}
