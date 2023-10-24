/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { DataProviderAdapterCoreModule } from '@fc/data-provider-adapter-core';

import { MockDataProviderController } from './controllers/mock-data-provider.controller';

@Module({
  imports: [DataProviderAdapterCoreModule],
  controllers: [MockDataProviderController],
})
export class MockDataProviderModule {}
