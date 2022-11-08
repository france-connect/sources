/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TrackingHandler } from '@fc/tracking';

import { DisplayedUserTracksEvent } from '../events';

@EventsHandler(DisplayedUserTracksEvent)
export class DisplayedUserTracksEventHandler
  extends TrackingHandler
  implements IEventHandler<DisplayedUserTracksEvent>
{
  async handle(event: DisplayedUserTracksEvent) {
    this.log(this.EventsMap.DISPLAYED_USER_TRACKS, event);
  }
}
