import { Module } from '@nestjs/common';

import { ApacheIgniteService } from './apache-ignite.service';

@Module({
  providers: [ApacheIgniteService],
  exports: [ApacheIgniteService],
})
export class ApacheIgniteModule {}
