import { TrackedEventInterface } from './tracked-event.interface';
/**
 * List all business events available and loggables
 * in an application.
 *
 * An application MUST expose an instance of `IEventMap` in order to use this library.
 */
export type TrackedEventMapType = Record<string, TrackedEventInterface>;
