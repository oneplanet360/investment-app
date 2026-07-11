import { IAdmin } from './database/models/admin.model';
import { IUser } from './database/models/user.model';

declare global {
  namespace Express {
    interface Request {
      admin?: IAdmin;
      user?: IUser;
    }
  }
}

export {};
