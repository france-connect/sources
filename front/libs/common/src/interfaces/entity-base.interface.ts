import type { UUIDType } from '../types';
import type { TimestampsInterface } from './timestamps.interface';

export interface EntityBaseInterface extends TimestampsInterface {
  id: UUIDType;
}
