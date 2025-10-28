import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate.js';
import { userData } from '../../controllers/auth.controller.js';

const   router = Router();

router.get('/', authenticate, userData)

export default router;
