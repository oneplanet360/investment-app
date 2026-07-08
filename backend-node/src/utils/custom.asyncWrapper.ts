import { type RequestHandler } from 'express';

export const customAsyncWrapper =
  (fn: CallableFunction): RequestHandler =>
  async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
