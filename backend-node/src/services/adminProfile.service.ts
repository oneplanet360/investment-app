import { Admin, IAdmin } from '../database/models/admin.model';
import { customError } from '../utils';
import { ApiErrorMessages, HttpStatusCode } from '../constants';

export const getAdminProfileService = async (
  adminId: string
): Promise<IAdmin> => {
  const admin = await Admin.findById(adminId).select('-password');
  if (!admin) {
    throw new customError(
      ApiErrorMessages.ADMIN_NOT_FOUND || 'Admin not found',
      HttpStatusCode.NOT_FOUND
    );
  }
  return admin;
};

export const updateAdminProfileService = async (
  adminId: string,
  payload: { name?: string; email?: string; avatarUrl?: string }
): Promise<IAdmin> => {
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new customError(
      ApiErrorMessages.ADMIN_NOT_FOUND || 'Admin not found',
      HttpStatusCode.NOT_FOUND
    );
  }

  if (payload.email && payload.email !== admin.email) {
    const existing = await Admin.findOne({ email: payload.email });
    if (existing) {
      throw new customError(
        'Email is already in use',
        HttpStatusCode.BAD_REQUEST
      );
    }
  }

  admin.set({
    name: payload.name || admin.name,
    email: payload.email || admin.email,
    avatarUrl:
      payload.avatarUrl !== undefined ? payload.avatarUrl : admin.avatarUrl,
  });

  await admin.save();
  admin.password = undefined; // Don't return password
  return admin;
};

export const updateAdminPasswordService = async (
  adminId: string,
  payload: { currentPassword?: string; newPassword?: string }
): Promise<IAdmin> => {
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new customError(
      ApiErrorMessages.ADMIN_NOT_FOUND || 'Admin not found',
      HttpStatusCode.NOT_FOUND
    );
  }

  if (!payload.currentPassword || !payload.newPassword) {
    throw new customError(
      'Current password and new password are required',
      HttpStatusCode.BAD_REQUEST
    );
  }

  if (admin.password !== payload.currentPassword) {
    throw new customError(
      'Incorrect current password',
      HttpStatusCode.BAD_REQUEST
    );
  }

  admin.password = payload.newPassword;
  await admin.save();
  admin.password = undefined;
  return admin;
};
