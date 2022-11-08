/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TrackingHandler } from '@fc/tracking';

import { UpdatedUserPreferencesFutureIdpEvent } from '../events';

@EventsHandler(UpdatedUserPreferencesFutureIdpEvent)
export class UpdatedUserPreferencesFutureIdpEventHandler
  extends TrackingHandler
  implements IEventHandler<UpdatedUserPreferencesFutureIdpEvent>
{
  async handle(event: UpdatedUserPreferencesFutureIdpEvent) {
    this.log(this.EventsMap.UPDATED_USER_PREFERENCES_FUTURE_IDP, event);
  }
}
