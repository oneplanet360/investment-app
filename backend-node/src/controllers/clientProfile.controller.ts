import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../database/models/user.model';
import { customAsyncWrapper } from '../utils/custom.asyncWrapper';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';

export const getProfileController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Not authenticated', HttpStatusCode.UNAUTHORIZED);
    }
    const user = await User.findById(req.user._id).select('-password');
    res.status(HttpStatusCode.OK).json({ success: true, user });
  }
);

export const updateProfileController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Not authenticated', HttpStatusCode.UNAUTHORIZED);
    }
    const { firstName, lastName, mobile, country, address, city, state, zip } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, mobile, country, address, city, state, zip },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  }
);

export const updatePasswordController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Not authenticated', HttpStatusCode.UNAUTHORIZED);
    }
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      throw new customError('Please provide old and new password', HttpStatusCode.BAD_REQUEST);
    }

    const user = await User.findById(req.user._id);
    if (!user || !user.password) {
      throw new customError('User not found', HttpStatusCode.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new customError('Incorrect old password', HttpStatusCode.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'Password updated successfully',
    });
  }
);
