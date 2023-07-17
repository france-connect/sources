/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { DataProviderAdapterCoreService } from './data-provider-adapter-core.service';

@Module({
  providers: [DataProviderAdapterCoreService],
  exports: [DataProviderAdapterCoreService],
})
export class DataProviderAdapterCoreModule {}
