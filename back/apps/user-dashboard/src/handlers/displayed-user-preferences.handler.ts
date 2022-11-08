/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TrackingHandler } from '@fc/tracking';

import { DisplayedUserPreferencesEvent } from '../events';

@EventsHandler(DisplayedUserPreferencesEvent)
export class DisplayedUserPreferencesEventHandler
  extends TrackingHandler
  implements IEventHandler<DisplayedUserPreferencesEvent>
{
  async handle(event: DisplayedUserPreferencesEvent) {
    this.log(this.EventsMap.DISPLAYED_USER_PREFERENCES, event);
  }
}
