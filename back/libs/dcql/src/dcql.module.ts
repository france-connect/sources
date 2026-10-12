import { Module } from '@nestjs/common';

import { DcqlService } from './services';
import { IsDcqlQueryConstraint } from './validators';

@Module({
  providers: [DcqlService, IsDcqlQueryConstraint],
  exports: [DcqlService, IsDcqlQueryConstraint],
})
export class DcqlModule {}
