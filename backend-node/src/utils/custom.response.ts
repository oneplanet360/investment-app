import { type Response } from 'express';
import { HttpStatusCode } from '../constants';

interface IApiResponse<T> {
  response: Response;
  statusCode: HttpStatusCode;
  success?: boolean;
  message?: string;
  data?: T;
}

export const customApiResponse = <T>({
  response,
  statusCode,
  success = true,
  message,
  data,
}: IApiResponse<T>) => {
  return response.status(statusCode).json({
    success,
    message,
    data,
  });
};

interface IApiResponseWithPagination<T> extends IApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const customApiResponseWithPagination = <T>({
  response,
  statusCode,
  success = true,
  message,
  data,
  pagination,
}: IApiResponseWithPagination<T>) => {
  return response.status(statusCode).json({
    success,
    message,
    data,
    pagination,
  });
};
