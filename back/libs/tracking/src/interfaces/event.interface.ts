/* istanbul ignore file */

// Declarative code
import { Type } from '@nestjs/common';

import { FcException } from '@fc/exceptions';

export interface IEvent {
  /**
   * Indicator of order in a flow scenario.
   * Helpful to build advanced analytics like funnel analysis.
   */
  readonly step?: string;

  /**
   * A "familly" of event, MAY be a feature or domain,
   * it's up to app developper,
   * but be sure to be consistent accross a given app.
   */
  readonly category: string;

  /**
   * Event name.
   * Use an explicit name
   */
  readonly event: string;

  /**
   * Controller route.
   *
   * Used by the interceptor to automatically log the event
   * when the route is handled.
   *
   * NB: This might be irrelevant in a future app,
   * for exemple if a single event may occur on different routes.
   * This case was not encountered so far.
   */
  readonly route: string;

  /**
   * Automatically log or not
   *
   * Used by the interceptor
   * to decide wether or not event should be automatically logged
   */
  readonly intercept: boolean;

  readonly exceptions: Array<Type<FcException>>;
}
