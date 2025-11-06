import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { JwtModule } from '@fc/jwt';
import { SignAdapterNativeModule } from '@fc/sign-adapter-native';

import { DataProviderAdapterCoreService } from './data-provider-adapter-core.service';

@Module({
  imports: [HttpModule, JwtModule.register(SignAdapterNativeModule)],
  providers: [DataProviderAdapterCoreService],
  exports: [DataProviderAdapterCoreService],
})
export class DataProviderAdapterCoreModule {}
