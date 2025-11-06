import type { MessageTypes } from '@fc/common';

export interface FieldMessage {
  content: string;
  level: MessageTypes;
  priority: number;
}
