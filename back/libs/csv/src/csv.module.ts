/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { CsvService } from './services';

@Module({
  exports: [CsvService],
  providers: [CsvService],
})
export class CsvModule {}
