import mongoose, { MongooseError } from 'mongoose';

import { GlobalErrorMessages, GlobalSuccessMessages } from '../constants';
import { customLogger } from '../utils';
import { ParsedEnvVariables } from './app.config';

export async function initializeMongoConnection() {
  const mongo_url = ParsedEnvVariables.MONGO_DB_URI;

  if (!mongo_url) {
    customLogger.warn(GlobalErrorMessages.MONGO_ENV_NOT_DEFINED);
    process.exit(1);
  }
  try {
    await mongoose.connect(mongo_url);
    customLogger.info(GlobalSuccessMessages.MONGO_CONNECTION_SUCCESS);
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      customLogger.error(`Mongoose Error: ${error.message}`);
    } else if (error instanceof Error) {
      customLogger.error(`Error: ${error.message}`);
    } else {
      customLogger.error(GlobalErrorMessages.MONGO_CONNECTION_ERROR, error);
    }
    process.exit(1);
  }
}
