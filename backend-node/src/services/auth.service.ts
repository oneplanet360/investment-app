import { ParsedEnvVariables } from '../configs';
import { ApiErrorMessages, HttpStatusCode } from '../constants';
import { Admin } from '../database/models/admin.model';
import { customError } from '../utils';
import { adminSignInSchemaType } from '../validations/auth.schema';
import jwt from 'jsonwebtoken';

export const signInAdminServices = async (body: adminSignInSchemaType) => {
  const { email, password } = body;

  const existingAdmin = await Admin.findOne({ email });

  if (!existingAdmin) {
    throw new customError(
      ApiErrorMessages.ADMIN_NOT_FOUND,
      HttpStatusCode.BAD_REQUEST
    );
  }

  if (existingAdmin.password !== password) {
    throw new customError(
      ApiErrorMessages.INVALID_CREDENTIALS,
      HttpStatusCode.BAD_REQUEST
    );
  }

  const adminData = {
    _id: existingAdmin._id,
    name: existingAdmin.name,
    email: existingAdmin.email,
  };

  const token = await jwt.sign(
    { _id: existingAdmin._id },
    ParsedEnvVariables.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return { admin: adminData, token };
};
