import { IEvent } from './event.interface';

/**
 * List all businnes events available and loggables
 * in an application.
 *
 * An application MUST expose an instance of `IEventMap` in order to use this library.
 */
export interface IEventMap {
  [key: string]: IEvent;
}
