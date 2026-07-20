import { Router } from 'express';
import { submitNomineeController, getNomineeStatusController } from '../controllers/clientNominee.controller';
import { clientAuthMiddleware } from '../middlewares/auth.middleware';
import multer from 'multer';
import { nomineeStorage } from '../configs/cloudinary.config';

const router = Router();
const upload = multer({ storage: nomineeStorage });

router.use(clientAuthMiddleware);

router.post(
  '/submit',
  upload.fields([
    { name: 'documentFront', maxCount: 1 },
    { name: 'documentBack', maxCount: 1 },
  ]),
  submitNomineeController
);

router.get(
  '/status',
  getNomineeStatusController
);

export default router;
