/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { MongooseModule } from '@fc/mongoose';

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
  providers: [MinistriesService],
  exports: [MinistriesService],
})
export class MinistriesModule {}
