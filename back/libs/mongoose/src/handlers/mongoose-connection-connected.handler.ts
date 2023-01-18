import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { MongooseConnectionConnectedEvent } from '../events';
import { MongooseCollectionOperationWatcherHelper } from '../helpers/mongoose-collection-update-watcher.helper';

@EventsHandler(MongooseConnectionConnectedEvent)
export class MongooseConnectionConnectedHandler
  implements IEventHandler<MongooseConnectionConnectedEvent>
{
  constructor(
    private readonly mongooseHelper: MongooseCollectionOperationWatcherHelper,
  ) {}

  public async handle(): Promise<void> {
    this.mongooseHelper.connectAllWatchers();
  }
}
