import { Request, Response } from 'express';
import { customAsyncWrapper, customError } from '../utils';
import { HttpStatusCode } from '../constants';
import { Kyc } from '../database/models/kyc.model';
import { User, KycStatus, UserRole } from '../database/models/user.model';
import { Notification } from '../database/models/notification.model';
import { Admin } from '../database/models/admin.model';

export const submitKycController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Unauthorized', HttpStatusCode.UNAUTHORIZED);
    }

    const { documentType, documentNumber } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const documentFront = files?.['documentFront']?.[0];
    const documentBack = files?.['documentBack']?.[0];

    if (!documentType || !documentFront) {
      throw new customError('Document Type and Document Front Image are required', HttpStatusCode.BAD_REQUEST);
    }

    const documentFrontUrl = documentFront.path;
    const documentBackUrl = documentBack ? documentBack.path : '';

    // Check if user already has pending or verified KYC
    const existingKyc = await Kyc.findOne({ userId: req.user._id });
    if (existingKyc && (existingKyc.status === KycStatus.PENDING || existingKyc.status === KycStatus.APPROVED)) {
      throw new customError(`Cannot submit. Current KYC status is ${existingKyc.status}`, HttpStatusCode.BAD_REQUEST);
    }

    // Create or update KYC record
    if (existingKyc) {
      existingKyc.documentType = documentType;
      existingKyc.documentNumber = documentNumber;
      existingKyc.documentFrontUrl = documentFrontUrl;
      existingKyc.documentBackUrl = documentBackUrl;
      existingKyc.status = KycStatus.PENDING;
      existingKyc.adminRemarks = '';
      await existingKyc.save();
    } else {
      await Kyc.create({
        userId: req.user._id,
        documentType,
        documentNumber,
        documentFrontUrl,
        documentBackUrl,
        status: KycStatus.PENDING,
      });
    }

    // Update user status
    await User.findByIdAndUpdate(req.user._id, { kycStatus: KycStatus.PENDING });

    // Notify admins
    const admins = await Admin.find({});
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        title: 'New KYC Submission',
        message: `User ${req.user.username} submitted KYC documents for review.`,
      });
    }

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: 'KYC submitted successfully',
    });
  }
);

export const getKycStatusController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new customError('Unauthorized', HttpStatusCode.UNAUTHORIZED);
    }

    const kyc = await Kyc.findOne({ userId: req.user._id });

    if (!kyc) {
      return res.status(HttpStatusCode.OK).json({
        success: true,
        kyc: null,
      });
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      kyc,
    });
  }
);
