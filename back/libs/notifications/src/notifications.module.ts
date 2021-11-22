/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationsService } from './notifications.service';
import { NotificationsSchema } from './schemas';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: 'Notifications',
        schema: NotificationsSchema,
      },
    ]),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService, MongooseModule],
})
export class NotificationsModule {}
