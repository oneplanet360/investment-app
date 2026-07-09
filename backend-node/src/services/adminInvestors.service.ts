import { User, UserRole } from '../database/models/user.model';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';

export const getInvestorsService = async (
  page: number = 1,
  limit: number = 20,
  search?: string
) => {
  const query: any = { role: UserRole.INVESTOR };

  if (search) {
    const regex = new RegExp(search, 'i');
    query.$or = [{ email: regex }, { username: regex }, { name: regex }];
  }

  const skip = (page - 1) * limit;

  const investors = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  return {
    data: investors,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const resetInvestorPasswordService = async (
  investorId: string,
  newPassword?: string
): Promise<void> => {
  if (!newPassword) {
    throw new customError(
      'New password is required',
      HttpStatusCode.BAD_REQUEST
    );
  }

  const investor = await User.findOne({
    _id: investorId,
    role: UserRole.INVESTOR,
  });
  if (!investor) {
    throw new customError('Investor not found', HttpStatusCode.NOT_FOUND);
  }

  investor.password = newPassword;
  await investor.save();
};
