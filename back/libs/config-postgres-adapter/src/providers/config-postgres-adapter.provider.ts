import { ConfigPostgresAdapterModule } from '../config-postgres-adapter.module';
import { ConfigPostgresAdapterService } from '../services';

export const ConfigPostgresAdapterProvider = {
  imports: [ConfigPostgresAdapterModule],
  provider: ConfigPostgresAdapterService,
};
