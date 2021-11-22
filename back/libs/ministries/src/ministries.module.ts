/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { MinistriesOperationTypeChangesHandler } from './handler';
import { MinistriesService } from './ministries.service';
import { MinistriesSchema } from './schemas';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: 'Ministries',
        schema: MinistriesSchema,
      },
    ]),
  ],
  providers: [MinistriesService, MinistriesOperationTypeChangesHandler],
  exports: [MinistriesService, MongooseModule],
})
export class MinistriesModule {}
