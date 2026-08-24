import { SseDisplayState } from '../enums';

export interface SseDisplayEventInterface {
  readonly display: SseDisplayState | null;
  readonly final: boolean;
}
