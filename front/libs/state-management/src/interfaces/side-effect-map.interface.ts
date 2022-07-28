/* istanbul ignore file */

// declarative file
import { SideEffectHandler } from './side-effect-handler.interface';

export interface SideEffectMap {
  [key: string]: SideEffectHandler;
}
