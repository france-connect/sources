import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { MongooseModule } from '@fc/mongoose';
import { MongooseChangeStreamModule } from '@fc/mongoose-change-stream';

import { NotificationSchema } from './schemas';
import { NotificationService } from './services';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: 'Notification',
        schema: NotificationSchema,
      },
    ]),
    MongooseChangeStreamModule,
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
