import http from 'http';
import app from './app';
import { ParsedEnvVariables } from './configs/app.config';
import { initializeMongoConnection } from './configs/mongo.config';
import { GlobalErrorMessages, GlobalSuccessMessages } from './constants';
import { customLogger } from './utils';

const startServer = async () => {
  try {
    await initializeMongoConnection();
    const server = http.createServer(app);

    server.listen(ParsedEnvVariables.PORT, () =>
      customLogger.info(GlobalSuccessMessages.DEV_SERVER_STARTED)
    );
  } catch (error) {
    customLogger.error(GlobalErrorMessages.DEV_SERVER_FAILED_TO_START, error);
    process.exit(1);
  }
};

startServer();

process.on('uncaughtException', (error: Error) => {
  customLogger.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error: Error) => {
  customLogger.error('Unhandled Rejection at:', error);
  process.exit(1);
});
