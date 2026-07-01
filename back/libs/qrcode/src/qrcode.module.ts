import { Module } from '@nestjs/common';

import { QrcodeService } from './services';

@Module({
  providers: [QrcodeService],
  exports: [QrcodeService],
})
export class QrcodeModule {}
