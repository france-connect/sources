import * as deepFreeze from 'deep-freeze';
import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MongooseChangeStreamService } from '@fc/mongoose-change-stream';

import { NotificationInterface } from '../interfaces';
import { Notification } from '../schemas';

@Injectable()
export class NotificationService {
  private listCache: NotificationInterface[];

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    private readonly changeStream: MongooseChangeStreamService,
  ) {}

  async onModuleInit() {
    this.changeStream.registerWatcher<Notification>(
      this.notificationModel,
      this.refreshCache.bind(this),
    );
    await this.getList();
  }

  async refreshCache(): Promise<void> {
    await this.getList(true);
  }

  private async findActiveNotification(): Promise<NotificationInterface[]> {
    const result = await this.notificationModel
      .find(
        {
          isActive: true,
          stopDate: { $gt: Date.now() },
        },
        {
          _id: false,
          message: true,
          startDate: true,
          stopDate: true,
        },
      )
      // Sort must be identical to what is done on CL
      // In this case it will put the last created first
      .sort({ _id: 'desc' })
      .lean();

    return result;
  }

  async getList(refreshCache?: boolean): Promise<NotificationInterface[]> {
    if (refreshCache || !this.listCache) {
      const list = await this.findActiveNotification();
      this.listCache = deepFreeze(list) as NotificationInterface[];
    }

    return this.listCache;
  }

  /**
   * Returns the first notification active now.
   * Warning: Be careful to implement the same logic as in CL,
   * as long as CL remains live.
   */
  async getNotificationToDisplay() {
    const list = await this.getList();
    const now = Date.now();

    const notification = list.find(
      ({ startDate, stopDate }) =>
        startDate.getTime() <= now && now < stopDate.getTime(),
    );

    return notification;
  }
}
