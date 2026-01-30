import { Module } from '@nestjs/common';

import { AnonymizerService } from './anonymizer.service';

@Module({
  providers: [AnonymizerService],
  exports: [AnonymizerService],
})
export class AnonymizerModule {}
