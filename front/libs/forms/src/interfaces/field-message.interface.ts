import type { EventTypes } from '@fc/common';

export interface FieldMessage {
  content: string;
  level: EventTypes;
  priority: number;
}
