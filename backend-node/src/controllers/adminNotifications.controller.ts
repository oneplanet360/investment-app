import { Request, Response } from 'express';
import { customAsyncWrapper, customError } from '../utils';
import { HttpStatusCode } from '../constants';
import { Notification } from '../database/models/notification.model';

export const getAdminNotificationsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Unauthorized', HttpStatusCode.UNAUTHORIZED);
    }

    const { limit = 20, unreadOnly = false } = req.query;

    const query: any = { userId: req.user._id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    res.status(HttpStatusCode.OK).json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  }
);

export const markNotificationReadController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Unauthorized', HttpStatusCode.UNAUTHORIZED);
    }

    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new customError('Notification not found', HttpStatusCode.NOT_FOUND);
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  }
);

export const markAllNotificationsReadController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Unauthorized', HttpStatusCode.UNAUTHORIZED);
    }

    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'All notifications marked as read',
    });
  }
);
