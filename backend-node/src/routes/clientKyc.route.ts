import { Router } from 'express';
import { submitKycController, getKycStatusController } from '../controllers/clientKyc.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads', 'kyc'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const router = Router();

router.use(clientAuthMiddleware);

router.post(
  '/',
  upload.fields([
    { name: 'documentFront', maxCount: 1 },
    { name: 'documentBack', maxCount: 1 },
  ]),
  submitKycController
);
router.get('/', getKycStatusController);

export default router;
