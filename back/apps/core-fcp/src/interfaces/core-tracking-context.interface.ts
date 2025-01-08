import { ICoreTrackingContext as BaseICoreTrackingContext } from '@fc/core';

export interface ICoreTrackingContext extends BaseICoreTrackingContext {
  readonly rep_scope?: string[];
}
