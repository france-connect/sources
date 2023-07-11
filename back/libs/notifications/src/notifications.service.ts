import * as deepFreeze from 'deep-freeze';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { LoggerService } from '@fc/logger-legacy';
import { MongooseCollectionOperationWatcherHelper } from '@fc/mongoose';

import { NotificationInterface } from './interfaces';

@Injectable()
export class NotificationsService {
  private listCache: NotificationInterface[];

  constructor(
    @InjectModel('Notifications')
    private readonly notificationsModel,
    private readonly logger: LoggerService,
    private readonly mongooseWatcher: MongooseCollectionOperationWatcherHelper,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit() {
    this.mongooseWatcher.watchWith(
      this.notificationsModel,
      this.refreshCache.bind(this),
    );
    this.logger.debug('Initializing notifications');

    await this.getList();
  }

  async refreshCache(): Promise<void> {
    await this.getList(true);
  }

  private async findActiveNotifications(): Promise<NotificationInterface[]> {
    const result = await this.notificationsModel
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

    this.logger.trace({ result });
    return result;
  }

  async getList(refreshCache?: boolean): Promise<NotificationInterface[]> {
    if (refreshCache || !this.listCache) {
      const list = await this.findActiveNotifications();
      this.listCache = deepFreeze(list) as NotificationInterface[];
      this.logger.trace({ notifications: this.listCache });
    }

    this.logger.trace({ notifications: this.listCache });

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
