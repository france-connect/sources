/* istanbul ignore file */

// declarative file
import { Module } from '@nestjs/common';

import { DataProviderCoreAuthModule } from '@fc/data-provider-core-auth';
import { ExceptionsModule } from '@fc/exceptions';
import { HttpProxyModule } from '@fc/http-proxy';
import { TracksModule } from '@fc/tracks';

import { TracksDataProviderController } from './controllers';

@Module({
  imports: [
    DataProviderCoreAuthModule,
    ExceptionsModule.withoutTracking(),
    HttpProxyModule,
    TracksModule,
  ],
  controllers: [TracksDataProviderController],
})
export class TracksDataProviderModule {}
