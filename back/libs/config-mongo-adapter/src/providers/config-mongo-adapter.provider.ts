import { ConfigMongoAdapterModule } from '../config-mongo-adapter.module';
import { ConfigMongoAdapterService } from '../services';

export const ConfigMongoAdapterProvider = {
  imports: [ConfigMongoAdapterModule],
  provider: ConfigMongoAdapterService,
};
