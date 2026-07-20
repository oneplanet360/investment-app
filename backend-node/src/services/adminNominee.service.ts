import { Nominee, INominee } from '../database/models/nominee.model';
import { User, KycStatus, IUser } from '../database/models/user.model';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';

export const getNomineeSubmissionsService = async (
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

  const nomineeRecords = await Nominee.find(query)
    .populate('userId', 'name username email role country')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Nominee.countDocuments(query);

  return {
    data: nomineeRecords,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getNomineeDetailService = async (id: string) => {
  const nomineeRecord = await Nominee.findById(id).populate(
    'userId',
    'name username email role country address'
  );
  if (!nomineeRecord) {
    throw new customError('Nominee record not found', HttpStatusCode.NOT_FOUND);
  }
  return nomineeRecord;
};

export const updateNomineeStatusService = async (
  id: string,
  status: KycStatus,
  remarks?: string
) => {
  if (!Object.values(KycStatus).includes(status)) {
    throw new customError('Invalid status', HttpStatusCode.BAD_REQUEST);
  }

  const nomineeRecord = await Nominee.findById(id);
  if (!nomineeRecord) {
    throw new customError('Nominee record not found', HttpStatusCode.NOT_FOUND);
  }

  nomineeRecord.status = status;
  if (remarks) nomineeRecord.adminRemarks = remarks;

  await nomineeRecord.save();

  // Also update the User's nomineeStatus
  await User.findByIdAndUpdate(nomineeRecord.userId, {
    nomineeStatus: status,
  });

  return nomineeRecord;
};
