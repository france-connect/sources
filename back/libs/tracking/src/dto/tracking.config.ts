import { IsObject } from 'class-validator';

import { TrackedEventMapType } from '../interfaces';

/**
 * @todo #1186 : Find out how to DTO validate object without predefined property names
 */
export class TrackingConfig {
  @IsObject()
  readonly eventsMap: TrackedEventMapType;
}
