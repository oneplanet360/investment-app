import { customAsyncWrapper } from './custom.asyncWrapper';
import { customError } from './custom.error';
import { customLogger } from './custom.logger';
import {
  customApiResponse,
  customApiResponseWithPagination,
} from './custom.response';

import crypto from 'crypto';

export const generateTransactionId = () => {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
};

export {
  customApiResponse,
  customApiResponseWithPagination,
  customAsyncWrapper,
  customError,
  customLogger,
};
