import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { customAsyncWrapper } from '../utils/custom.asyncWrapper';
import { customError } from '../utils';
import { HttpStatusCode } from '../constants';
import { Agent, Investor, UserRole, KycStatus } from '../database/models/user.model';

export const searchUnassignedUserController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError('Only agents can search', HttpStatusCode.UNAUTHORIZED);
    }
    
    const { username, targetRole } = req.query;
    if (!username || !targetRole) {
      throw new customError('Username and targetRole are required', HttpStatusCode.BAD_REQUEST);
    }

    let Model = targetRole === 'INVESTOR' ? Investor : Agent;
    
    // For agents, we check sponsor. For investors, referredBy.
    const query = targetRole === 'INVESTOR' 
      ? { username: username as string, referredBy: { $exists: false } }
      : { username: username as string, sponsor: { $exists: false } };

    const user = await Model.findOne(query).select('name username email createdAt');
    
    if (!user) {
      return res.status(HttpStatusCode.OK).json({ success: true, user: null, message: 'User not found or already assigned' });
    }

    res.status(HttpStatusCode.OK).json({ success: true, user });
  }
);

export const assignAgentController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError('Only agents can assign sub-agents', HttpStatusCode.UNAUTHORIZED);
    }

    const sponsor = req.user as any;
    if (sponsor.level >= 4) {
      throw new customError('Agents at level 4 cannot assign sub-agents', HttpStatusCode.FORBIDDEN);
    }

    const { username } = req.body;
    if (!username) throw new customError('Username is required', HttpStatusCode.BAD_REQUEST);

    const subAgent = await Agent.findOne({ username, sponsor: { $exists: false } });
    if (!subAgent) {
      throw new customError('Agent not found or already assigned', HttpStatusCode.NOT_FOUND);
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
      }
    });
  }
);

export const assignInvestorController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError('Only agents can assign investors', HttpStatusCode.UNAUTHORIZED);
    }

    const agent = req.user as any;
    if (agent.level !== 4) {
      throw new customError('Only Level 4 agents can assign investors', HttpStatusCode.FORBIDDEN);
    }

    const { username } = req.body;
    if (!username) throw new customError('Username is required', HttpStatusCode.BAD_REQUEST);

    const investor = await Investor.findOne({ username, referredBy: { $exists: false } });
    if (!investor) {
      throw new customError('Investor not found or already assigned', HttpStatusCode.NOT_FOUND);
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
      }
    });
  }
);

export const getAllInvestorsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== UserRole.AGENT) {
      throw new customError('Only agents can view their investors', HttpStatusCode.UNAUTHORIZED);
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
      throw new customError('Only agents can view tree', HttpStatusCode.UNAUTHORIZED);
    }

    const getDownline = async (agentId: string, currentLevel: number): Promise<any> => {
      if (currentLevel >= 4) {
        const investors = await Investor.find({ referredBy: agentId }).select('name username email kycStatus createdAt');
        return investors;
      }
      
      const subAgents = await Agent.find({ sponsor: agentId }).select('name username email level kycStatus createdAt');
      const downline = [];
      for (const sub of subAgents) {
        const subAgentData = sub.toObject();
        const children = await getDownline(sub._id.toString(), subAgentData.level);
        if (subAgentData.level === 4) {
          subAgentData.investors = children;
        } else {
          subAgentData.subAgents = children;
        }
        downline.push(subAgentData);
      }
      return downline;
    };

    const rootAgent = await Agent.findById(req.user._id).select('name username email level kycStatus createdAt');
    if (!rootAgent) throw new customError('Agent not found', 404);
    
    const tree = rootAgent.toObject();
    const children = await getDownline(req.user._id.toString(), tree.level);
    if (tree.level === 4) {
      tree.investors = children;
    } else {
      tree.subAgents = children;
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      tree,
    });
  }
);
