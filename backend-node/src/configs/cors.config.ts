import { type CorsOptions } from 'cors';
import { ParsedEnvVariables } from './app.config';

const { CORS_ORIGIN } = ParsedEnvVariables;

const allowedOrigins = CORS_ORIGIN.split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const origin = (origin: string | undefined, callback: CallableFunction) => {
  if (!origin) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error(`CORS blocked for origin: ${origin}`));
};

export const corsOptions: CorsOptions = {
  origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  optionsSuccessStatus: 204,
};
