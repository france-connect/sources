/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { MongooseModule } from '@fc/mongoose';

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
  exports: [MinistriesService],
})
export class MinistriesModule {}
