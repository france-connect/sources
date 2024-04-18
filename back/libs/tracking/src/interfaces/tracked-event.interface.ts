/* istanbul ignore file */

// Declarative code
import { RequestMethod, Type } from '@nestjs/common';

import { FcException } from '@fc/exceptions-deprecated';

export interface InterceptRouteInterface {
  method: RequestMethod;
  path: string;
}

export interface TrackedEventInterface {
  /**
   * A "family" of event, MAY be a feature or domain,
   * it's up to app developer,
   * but be sure to be consistent across a given app.
   */
  readonly category: string;

  /**
   * Event name.
   * Use an explicit name
   */
  readonly event: string;

  /**
   * Indicator of order in a flow scenario.
   * Helpful to build advanced analytics like funnel analysis.
   */
  readonly step?: string;

  /**
   * Automatically track a given route
   *
   * The given route will be automatically tracked
   */
  readonly interceptRoutes?: InterceptRouteInterface[];

  /**
   * Automatically track exception
   */
  readonly exceptions?: Array<Type<FcException>>;
}
