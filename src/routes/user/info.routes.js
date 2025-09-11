import express from 'express';
import { alterInfo } from '../../controllers/user/info.controller.js';
import { authorize } from '../../middleware/authorize.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = express.Router();

router.patch('/update/:userId', authenticate, alterInfo);

export default router;