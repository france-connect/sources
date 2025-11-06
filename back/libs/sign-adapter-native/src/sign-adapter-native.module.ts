import { Module } from '@nestjs/common';

import { SIGN_ADAPTER_TOKEN } from '@fc/sign-adapter';

import { SignAdapterNativeService } from './services';

const provider = {
  provide: SIGN_ADAPTER_TOKEN,
  useClass: SignAdapterNativeService,
};
@Module({
  providers: [provider],
  exports: [provider],
})
export class SignAdapterNativeModule {}
