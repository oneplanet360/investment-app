import { Request, Response } from 'express';
import { customAsyncWrapper } from '../utils/custom.asyncWrapper';
import bcrypt from 'bcryptjs';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';
import {
  Agent,
  Investor,
  UserRole,
  KycStatus,
} from '../database/models/user.model';
import { Commission } from '../database/models/commission.model';

export const searchUnassignedUserController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError(
        'Only agents can search',
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const { username, targetRole } = req.query;
    if (!username || !targetRole) {
      throw new customError(
        'Username and targetRole are required',
        HttpStatusCode.BAD_REQUEST
      );
    }

    const Model = targetRole === 'INVESTOR' ? Investor : Agent;

    // For agents, we check sponsor. For investors, referredBy.
    const query =
      targetRole === 'INVESTOR'
        ? {
            username: username as string,
            $or: [{ referredBy: { $exists: false } }, { referredBy: null }],
          }
        : {
            username: username as string,
            $or: [{ sponsor: { $exists: false } }, { sponsor: null }],
          };

    const user = await (Model as any)
      .findOne(query)
      .select('name username email createdAt');

    if (!user) {
      return res.status(HttpStatusCode.OK).json({
        success: true,
        user: null,
        message: 'User not found or already assigned',
      });
    }

    res.status(HttpStatusCode.OK).json({ success: true, user });
  }
);

export const assignAgentController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError(
        'Only agents can assign sub-agents',
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const sponsor = req.user as any;

    const { username } = req.body;
    if (!username)
      throw new customError('Username is required', HttpStatusCode.BAD_REQUEST);

    const subAgent = await Agent.findOne({
      username,
      $or: [{ sponsor: { $exists: false } }, { sponsor: null }],
    });
    if (!subAgent) {
      throw new customError(
        'Agent not found or already assigned',
        HttpStatusCode.NOT_FOUND
      );
    }

    subAgent.sponsor = sponsor._id;
    subAgent.level = sponsor.level + 1;
    await subAgent.save();

    await Agent.findByIdAndUpdate(sponsor._id, { $inc: { downlineCount: 1 } });

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'Sub-agent assigned successfully',
      agent: {
        _id: subAgent._id,
        username: subAgent.username,
        level: subAgent.level,
      },
    });
  }
);

export const assignInvestorController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError(
        'Only agents can assign investors',
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const agent = req.user as any;

    const { username } = req.body;
    if (!username)
      throw new customError('Username is required', HttpStatusCode.BAD_REQUEST);

    const investor = await Investor.findOne({
      username,
      $or: [{ referredBy: { $exists: false } }, { referredBy: null }],
    });
    if (!investor) {
      throw new customError(
        'Investor not found or already assigned',
        HttpStatusCode.NOT_FOUND
      );
    }

    investor.referredBy = req.user._id;
    await investor.save();

    await Agent.findByIdAndUpdate(req.user._id, { $inc: { downlineCount: 1 } });

    // Notify Admins
    const { Notification } = require('../database/models/notification.model');
    const AdminModel = require('../database/models/admin.model').Admin;
    const admins = await AdminModel.find({});
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        title: 'New Investor Assigned',
        message: `Agent ${agent.username} assigned investor: ${investor.username}`,
      });
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'Investor assigned successfully',
      investor: {
        _id: investor._id,
        username: investor.username,
      },
    });
  }
);

export const createInvestorController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError(
        'Only agents can create investors',
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const agent = req.user as any;

    const { name, email, username, password, mobile } = req.body;

    if (!name || !email || !username || !password) {
      throw new customError(
        'Name, email, username, and password are required',
        HttpStatusCode.BAD_REQUEST
      );
    }

    const existingUser = await Investor.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      throw new customError(
        'Email or username is already in use',
        HttpStatusCode.BAD_REQUEST
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newInvestor = new Investor({
      name,
      email,
      username,
      password: hashedPassword,
      mobile,
      role: UserRole.INVESTOR,
      referredBy: agent._id,
      kycStatus: KycStatus.UNVERIFIED,
      walletBalance: 0,
      investmentBalance: 0,
      roiBalance: 0,
    });

    await newInvestor.save();

    await Agent.findByIdAndUpdate(agent._id, { $inc: { downlineCount: 1 } });

    const { Notification } = require('../database/models/notification.model');
    const AdminModel = require('../database/models/admin.model').Admin;
    const admins = await AdminModel.find({});
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        title: 'New Investor Created',
        message: `Agent ${agent.username} created a new investor: ${newInvestor.username}`,
      });
    }

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: 'Investor created successfully',
      investor: {
        _id: newInvestor._id,
        username: newInvestor.username,
        name: newInvestor.name,
        email: newInvestor.email,
      },
    });
  }
);

export const getAllInvestorsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError(
        'Only agents can view their investors',
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const investors = await Investor.find({ referredBy: req.user._id })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(HttpStatusCode.OK).json({
      success: true,
      investors,
    });
  }
);

export const getAgentTreeController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError(
        'Only agents can view tree',
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const getDownline = async (
      agentId: string,
      currentLevel: number
    ): Promise<any> => {
      const investors = await Investor.find({ referredBy: agentId }).select(
        'name username email kycStatus createdAt'
      );
      const subAgents = await Agent.find({ sponsor: agentId }).select(
        'name username email level kycStatus createdAt'
      );

      const downline = [];

      for (const sub of subAgents) {
        const subAgentData = sub.toObject();
        const children = await getDownline(
          sub._id.toString(),
          subAgentData.level
        );
        (subAgentData as any).subAgents = children.subAgents;
        (subAgentData as any).investors = children.investors;
        downline.push(subAgentData);
      }

      return { subAgents: downline, investors };
    };

    const rootAgent = await Agent.findById(req.user._id).select(
      'name username email level kycStatus createdAt'
    );
    if (!rootAgent) throw new customError('Agent not found', 404);

    const tree = rootAgent.toObject();
    const children = await getDownline(req.user._id.toString(), tree.level);
    (tree as any).subAgents = children.subAgents;
    (tree as any).investors = children.investors;

    res.status(HttpStatusCode.OK).json({
      success: true,
      tree,
    });
  }
);

export const getAgentCommissionsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError(
        'Only agents can view commissions',
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const commissions = await Commission.find({ agentId: req.user._id })
      .populate('investorId', 'name username')
      .sort({ createdAt: -1 });

    res.status(HttpStatusCode.OK).json({
      success: true,
      commissions,
    });
  }
);

export const getAgentDashboardStatsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError(
        'Only agents can view dashboard stats',
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const agent = await Agent.findById(req.user._id);
    if (!agent) {
      throw new customError('Agent not found', HttpStatusCode.NOT_FOUND);
    }

    const commissions = await Commission.find({ agentId: req.user._id });
    const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
    const level1Commissions = commissions
      .filter((c) => c.level === 1)
      .reduce((sum, c) => sum + c.amount, 0);

    const recentCommissions = await Commission.find({ agentId: req.user._id })
      .populate('investorId', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(HttpStatusCode.OK).json({
      success: true,
      stats: {
        totalBalance: agent.commissionBalance,
        activeReferrals: agent.downlineCount,
        totalCommissions,
        level1Bonuses: level1Commissions,
        recentCommissions,
      },
    });
  }
);
