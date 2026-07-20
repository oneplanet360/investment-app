import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const investmentsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'investment-app/investments',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    };
  },
});

export const kycStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'investment-app/kyc',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    };
  },
});

export const nomineeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'investment-app/nominee',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    };
  },
});

export default cloudinary;
