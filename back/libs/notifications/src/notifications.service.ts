import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { INotifications } from './interfaces';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notifications')
    private readonly notificationsModel,
  ) {}

  private async findActiveNotifications(): Promise<INotifications> {
    const result = await this.notificationsModel
      .findOne(
        {
          isActive: true,
        },
        {
          _id: false,
          message: true,
        },
      )
      .exec();

    return result;
  }
  async getNotifications(): Promise<INotifications> {
    const notifications: INotifications = await this.findActiveNotifications();
    return notifications;
  }
}
