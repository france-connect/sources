import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { DataProviderAdapterCoreModule } from '@fc/data-provider-adapter-core';
import { HttpProxyModule } from '@fc/http-proxy';

import { MockDataProviderController } from './controllers';
import { MockDataProviderService } from './services';

@Module({
  imports: [
    DataProviderAdapterCoreModule,
    HttpModule,
    HttpProxyModule,
    AsyncLocalStorageModule,
  ],
  controllers: [MockDataProviderController],
  providers: [MockDataProviderService],
})
export class MockDataProviderModule {}
