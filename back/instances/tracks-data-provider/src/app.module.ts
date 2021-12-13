import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { LoggerModule } from '@fc/logger';
import { TracksDataProviderModule } from '@fc/tracks-data-provider';

@Module({})
export class AppModule {
  static forRoot(configService: ConfigService): DynamicModule {
    return {
      imports: [
        // 1. Load config module first
        ConfigModule.forRoot(configService),
        // 2. Load logger module next
        LoggerModule,
        // 3. Load other modules
        TracksDataProviderModule,
      ],
      module: AppModule,
    };
  }
}
