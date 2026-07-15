import { Router } from 'express';
import {
  createInvestmentController,
  getClientInvestmentsController,
  closeInvestmentController,
} from '../controllers/clientInvestments.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads', 'investments'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

const router = Router();

router.use(clientAuthMiddleware);

router.get('/', getClientInvestmentsController);
router.post(
  '/create',
  upload.single('paymentProof'),
  createInvestmentController
);
router.post('/close', closeInvestmentController);

export default router;
