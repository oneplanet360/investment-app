import { NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import { GlobalErrorMessages, HttpStatusCode } from '../constants';
import { customError } from '../utils';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const formatZodError = (error: ZodError) => {
  const errors = error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return errors;
};

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response | void => {
  if (error instanceof SyntaxError) {
    return res.status(HttpStatusCode.FORBIDDEN).json({
      message: error.message || GlobalErrorMessages.INVALID_JSON_FORMAT,
    });
  }

  if (error instanceof ZodError) {
    const errors = formatZodError(error);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: GlobalErrorMessages.VALIDATION_FAILED,
      errors: errors,
    });
  }

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(HttpStatusCode.PAYLOAD_TOO_LARGE).json({
        message: 'Each file must be 5MB or smaller.',
      });
    }

    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: error.message,
    });
  }

  if (error instanceof JsonWebTokenError) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: error.message || GlobalErrorMessages.UNAUTHORIZED,
    });
  }

  if (error instanceof TokenExpiredError) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: error.message || GlobalErrorMessages.UNAUTHORIZED,
    });
  }

  if (error instanceof customError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER).json({
    message: GlobalErrorMessages.INTERNAL_SERVER_ERROR,
  });
};
