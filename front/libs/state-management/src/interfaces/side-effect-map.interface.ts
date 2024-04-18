/* istanbul ignore file */

// declarative file
import type { SideEffectHandler } from './side-effect-handler.interface';

export interface SideEffectMap {
  [key: string]: SideEffectHandler;
}
