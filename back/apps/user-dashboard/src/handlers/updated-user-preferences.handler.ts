/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TrackingHandler } from '@fc/tracking';

import { UpdatedUserPreferencesEvent } from '../events';

@EventsHandler(UpdatedUserPreferencesEvent)
export class UpdatedUserPreferencesEventHandler
  extends TrackingHandler
  implements IEventHandler<UpdatedUserPreferencesEvent>
{
  async handle(event: UpdatedUserPreferencesEvent) {
    this.log(this.EventsMap.UPDATED_USER_PREFERENCES, event);
  }
}
