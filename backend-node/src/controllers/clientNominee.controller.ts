import { Request, Response } from 'express';
import { customAsyncWrapper, customError } from '../utils';
import { HttpStatusCode } from '../constants';
import { Nominee } from '../database/models/nominee.model';
import { User, KycStatus } from '../database/models/user.model';
import { Notification } from '../database/models/notification.model';
import { Admin } from '../database/models/admin.model';

export const submitNomineeController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Unauthorized', HttpStatusCode.UNAUTHORIZED);
    }

    const { nomineeName, relation, documentType, documentNumber } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const documentFront = files?.['documentFront']?.[0];
    const documentBack = files?.['documentBack']?.[0];

    if (!nomineeName || !relation || !documentType || !documentFront) {
      throw new customError('Nominee Name, Relation, Document Type, and Document Front Image are required', HttpStatusCode.BAD_REQUEST);
    }

    const documentFrontUrl = documentFront.path;
    const documentBackUrl = documentBack ? documentBack.path : '';

    // Check if user already has pending or verified Nominee
    const existingNominee = await Nominee.findOne({ userId: req.user._id });
    if (existingNominee && (existingNominee.status === KycStatus.PENDING || existingNominee.status === KycStatus.APPROVED)) {
      throw new customError(`Cannot submit. Current Nominee status is ${existingNominee.status}`, HttpStatusCode.BAD_REQUEST);
    }

    // Create or update Nominee record
    if (existingNominee) {
      existingNominee.nomineeName = nomineeName;
      existingNominee.relation = relation;
      existingNominee.documentType = documentType;
      existingNominee.documentNumber = documentNumber;
      existingNominee.documentFrontUrl = documentFrontUrl;
      existingNominee.documentBackUrl = documentBackUrl;
      existingNominee.status = KycStatus.PENDING;
      existingNominee.adminRemarks = '';
      await existingNominee.save();
    } else {
      await Nominee.create({
        userId: req.user._id,
        nomineeName,
        relation,
        documentType,
        documentNumber,
        documentFrontUrl,
        documentBackUrl,
        status: KycStatus.PENDING,
      });
    }

    // Update user status
    await User.findByIdAndUpdate(req.user._id, { nomineeStatus: KycStatus.PENDING });

    // Notify admins
    const admins = await Admin.find({});
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        title: 'New Nominee Verification Submission',
        message: `User ${req.user.username} submitted nominee documents for review.`,
      });
    }

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: 'Nominee verification submitted successfully',
    });
  }
);

export const getNomineeStatusController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Unauthorized', HttpStatusCode.UNAUTHORIZED);
    }

    const nominee = await Nominee.findOne({ userId: req.user._id });

    if (!nominee) {
      return res.status(HttpStatusCode.OK).json({
        success: true,
        nominee: null,
      });
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      nominee,
    });
  }
);
