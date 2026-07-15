import { Request, Response } from 'express';
import { customApiResponse, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import { Notification } from '../database/models/notification.model';

export const getClientNotificationsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Notifications retrieved successfully',
      data: {
        notifications,
        unreadCount,
      },
    });
  }
);

export const markNotificationReadController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Notification marked as read',
      data: notification,
    });
  }
);
