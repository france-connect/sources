import { Module } from '@nestjs/common';

import { CsmrHsmClientModule } from '@fc/csmr-hsm-client';
import { SIGN_ADAPTER_TOKEN } from '@fc/sign-adapter';

import { SignAdapterHsmService } from './services';

const provider = {
  provide: SIGN_ADAPTER_TOKEN,
  useClass: SignAdapterHsmService,
};
@Module({
  imports: [CsmrHsmClientModule],
  providers: [provider],
  exports: [provider],
})
export class SignAdapterHsmModule {}
