import type { AnyObjectInterface } from '@fc/common';

export interface ResponseErrorInterface {
  code: string;
  id: string;
  message: string;
  payload: AnyObjectInterface<string>;
}
