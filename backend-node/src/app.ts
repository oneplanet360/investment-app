import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import path from 'path';
import { ParsedEnvVariables, corsOptions } from './configs';
import { errorMiddleware } from './middlewares';
import {
  authRoutes,
  adminSettingsRoute,
  adminProfileRoute,
  adminAgentsRoute,
  adminKycRoute,
  adminInvestorsRoute,
} from './routes';

const app: Application = express();

/** Logging Middleware */
if (ParsedEnvVariables.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/** Security & Performance Middlewares */
app.use(compression());
app.use(hpp());

/** middlewares */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    frameguard: false, // Allow embedding in iframes for PDF preview
  })
);
app.use(cors(corsOptions));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin-settings', adminSettingsRoute);
app.use('/api/v1/admin/profile', adminProfileRoute);
app.use('/api/v1/agents', adminAgentsRoute);
app.use('/api/v1/kyc', adminKycRoute);
app.use('/api/v1/investors', adminInvestorsRoute);

/** error middleware. */
app.use(errorMiddleware);

export default app;
