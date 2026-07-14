import { ParsedEnvVariables } from '../configs';
import { ApiErrorMessages, HttpStatusCode } from '../constants';
import { Admin } from '../database/models/admin.model';
import { User } from '../database/models/user.model';
import { customError } from '../utils';
import { adminSignInSchemaType, clientSignInSchemaType } from '../validations/auth.schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signInAdminServices = async (body: adminSignInSchemaType) => {
  const { email, password } = body;

  const existingAdmin = await Admin.findOne({ email });

  if (!existingAdmin) {
    throw new customError(
      ApiErrorMessages.ADMIN_NOT_FOUND,
      HttpStatusCode.BAD_REQUEST
    );
  }

  if (!existingAdmin.password) {
    throw new customError(
      ApiErrorMessages.INVALID_CREDENTIALS,
      HttpStatusCode.BAD_REQUEST
    );
  }

  const isMatchAdmin = await bcrypt.compare(password, existingAdmin.password);
  if (!isMatchAdmin) {
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

export const signInClientServices = async (body: clientSignInSchemaType) => {
  const { email, password } = body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new customError(
      'User not found.',
      HttpStatusCode.BAD_REQUEST
    );
  }

  if (!existingUser.password) {
    throw new customError(
      ApiErrorMessages.INVALID_CREDENTIALS,
      HttpStatusCode.BAD_REQUEST
    );
  }

  const isMatchClient = await bcrypt.compare(password, existingUser.password);
  if (!isMatchClient) {
    throw new customError(
      ApiErrorMessages.INVALID_CREDENTIALS,
      HttpStatusCode.BAD_REQUEST
    );
  }

  if (!existingUser.isActive) {
    throw new customError(
      'Your account has been banned.',
      HttpStatusCode.BAD_REQUEST
    );
  }

  const userData = {
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    level: (existingUser as any).level,
    username: existingUser.username,
  };

  const token = await jwt.sign(
    { _id: existingUser._id, role: existingUser.role },
    ParsedEnvVariables.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return { user: userData, token };
};

export const impersonateClientService = async (userId: string) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new customError(
      'User not found.',
      HttpStatusCode.BAD_REQUEST
    );
  }

  if (!existingUser.isActive) {
    throw new customError(
      'Your account has been banned.',
      HttpStatusCode.BAD_REQUEST
    );
  }

  const userData = {
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    level: (existingUser as any).level,
    username: existingUser.username,
  };

  const token = await jwt.sign(
    { _id: existingUser._id, role: existingUser.role },
    ParsedEnvVariables.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return { user: userData, token };
};
