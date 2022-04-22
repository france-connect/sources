import { ILoggerBusinessEvent } from '@fc/logger-legacy';

/**
 * Use a class as interface, to enforce properties restriction
 *
 * We want applications to extends this class.
 * We do not want to allow arbitrary properties.
 */
export abstract class ITrackingLog extends ILoggerBusinessEvent {}
