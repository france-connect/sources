/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TrackingHandler } from '@fc/tracking';

import { UpdatedUserPreferencesIdpEvent } from '../events';

@EventsHandler(UpdatedUserPreferencesIdpEvent)
export class UpdatedUserPreferencesIdpEventHandler
  extends TrackingHandler
  implements IEventHandler<UpdatedUserPreferencesIdpEvent>
{
  async handle(event: UpdatedUserPreferencesIdpEvent) {
    this.log(this.EventsMap.UPDATED_USER_PREFERENCES_IDP, event);
  }
}
