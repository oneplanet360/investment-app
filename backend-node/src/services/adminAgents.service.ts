import { User, UserRole, IUser } from '../database/models/user.model';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';
import bcrypt from 'bcryptjs';

export const createAgentService = async (
  payload: Partial<IUser>
): Promise<IUser> => {
  // Check if email or username already exists
  const existingUser = await User.findOne({
    $or: [{ email: payload.email }, { username: payload.username }],
  });

  if (existingUser) {
    throw new customError(
      'Email or username is already in use',
      HttpStatusCode.BAD_REQUEST
    );
  }

  let sponsorId = undefined;
  let level = 1;

  if ((payload as any).referredBy) {
    // payload.referredBy comes in as the sponsor's username from the UI (string)
    const sponsor = await User.findOne({
      username: (payload as any).referredBy as unknown as string,
      role: UserRole.AGENT,
    });
    if (!sponsor) {
      throw new customError('Sponsor not found', HttpStatusCode.NOT_FOUND);
    }
    // Typecast to IAgent to access level
    const sponsorAgent = sponsor as any;
    if (sponsorAgent.level >= 4) {
      throw new customError(
        'Cannot create agents under a level 4 agent',
        HttpStatusCode.BAD_REQUEST
      );
    }

    sponsorId = sponsor._id;
    level = (sponsorAgent.level || 1) + 1;
  }

  const name =
    `${payload.firstName || ''} ${payload.lastName || ''}`.trim() ||
    payload.username ||
    'Agent';

  const newAgent = new User({
    ...payload,
    name,
    role: UserRole.AGENT,
    referredBy: sponsorId,
    level,
  });

  await newAgent.save();
  newAgent.password = undefined; // Do not return password
  return newAgent;
};

export const getAgentsService = async (
  page: number = 1,
  limit: number = 20,
  search?: string
) => {
  const query: any = { role: UserRole.AGENT };

  if (search) {
    const regex = new RegExp(search, 'i');
    query.$or = [{ email: regex }, { username: regex }, { name: regex }];
  }

  const skip = (page - 1) * limit;

  const agents = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  return {
    data: agents,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const resetAgentPasswordService = async (
  agentId: string,
  newPassword?: string
): Promise<void> => {
  if (!newPassword) {
    throw new customError(
      'New password is required',
      HttpStatusCode.BAD_REQUEST
    );
  }

  const agent = await User.findOne({ _id: agentId, role: UserRole.AGENT });
  if (!agent) {
    throw new customError('Agent not found', HttpStatusCode.NOT_FOUND);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  agent.password = hashedPassword;
  await agent.save();
};
