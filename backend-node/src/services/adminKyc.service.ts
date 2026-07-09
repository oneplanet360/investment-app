import { Kyc, IKyc } from '../database/models/kyc.model';
import { User, KycStatus, IUser } from '../database/models/user.model';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';

export const getKycSubmissionsService = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string
) => {
  const query: any = {};

  if (status) {
    query.status = status;
  }

  // To search by user's email, name, or username, we need to find matching users first
  if (search) {
    const regex = new RegExp(search, 'i');

    // Find matching users
    const users = await User.find({
      $or: [{ email: regex }, { name: regex }, { username: regex }],
    }).select('_id');
    const userIds = users.map((u) => u._id);

    // Filter by either user matches OR document number match
    query.$or = [{ userId: { $in: userIds } }, { documentNumber: regex }];
  }

  const skip = (page - 1) * limit;

  const kycRecords = await Kyc.find(query)
    .populate('userId', 'name username email role country')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Kyc.countDocuments(query);

  return {
    data: kycRecords,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getKycDetailService = async (id: string) => {
  const kycRecord = await Kyc.findById(id).populate(
    'userId',
    'name username email role country address'
  );
  if (!kycRecord) {
    throw new customError('KYC record not found', HttpStatusCode.NOT_FOUND);
  }
  return kycRecord;
};

export const updateKycStatusService = async (
  id: string,
  status: KycStatus,
  remarks?: string
) => {
  if (!Object.values(KycStatus).includes(status)) {
    throw new customError('Invalid status', HttpStatusCode.BAD_REQUEST);
  }

  const kycRecord = await Kyc.findById(id);
  if (!kycRecord) {
    throw new customError('KYC record not found', HttpStatusCode.NOT_FOUND);
  }

  kycRecord.status = status;
  if (remarks) kycRecord.adminRemarks = remarks;

  await kycRecord.save();

  // Also update the User's kycStatus
  await User.findByIdAndUpdate(kycRecord.userId, {
    kycStatus: status,
  });

  return kycRecord;
};
