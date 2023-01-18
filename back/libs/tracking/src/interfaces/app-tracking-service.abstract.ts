import { TrackedEventInterface } from './tracked-event.interface';
import { TrackedEventContextInterface } from './tracked-event-context.interface';
import { TrackingLogInterface } from './tracking-log.interface';

export abstract class AppTrackingServiceAbstract {
  abstract buildLog(
    event: TrackedEventInterface,
    context: TrackedEventContextInterface,
  ): Promise<TrackingLogInterface>;
}
