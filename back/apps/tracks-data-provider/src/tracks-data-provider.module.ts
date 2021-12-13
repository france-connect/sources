/* istanbul ignore file */

// declarative file
import { Module } from '@nestjs/common';

import { DataProviderCoreAuthModule } from '@fc/data-provider-core-auth';
import { ExceptionsModule } from '@fc/exceptions';
import { TracksModule } from '@fc/tracks';

import { TracksDataProviderController } from './controllers';

@Module({
  imports: [ExceptionsModule, DataProviderCoreAuthModule, TracksModule],
  controllers: [TracksDataProviderController],
})
export class TracksDataProviderModule {}
