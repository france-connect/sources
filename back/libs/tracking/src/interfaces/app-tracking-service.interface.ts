import { IEvent } from './event.interface';
import { IEventContext } from './event-context.interface';
import { IEventMap } from './event-map.interface';
import { ITrackingLog } from './tracking-log.interface';

export abstract class IAppTrackingService {
  readonly EventsMap: IEventMap;
  abstract buildLog(
    event: IEvent,
    context: IEventContext,
  ): Promise<ITrackingLog>;
}
