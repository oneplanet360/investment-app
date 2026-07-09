import { IAdmin } from './database/models/admin.model';

declare global {
  namespace Express {
    interface Request {
      admin?: IAdmin;
    }
  }
}

export {};
