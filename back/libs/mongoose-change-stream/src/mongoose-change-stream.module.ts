import { Global, Module } from '@nestjs/common';

import { MongooseChangeStreamService } from './services';

@Global()
@Module({
  providers: [MongooseChangeStreamService],
  exports: [MongooseChangeStreamService],
})
export class MongooseChangeStreamModule {}
