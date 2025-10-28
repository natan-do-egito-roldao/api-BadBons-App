import { Router } from 'express';
import { loginToken } from '../../controllers/auth.controller.js'
import { authenticate } from '../../middleware/authenticate.js';

const   router = Router();

router.post('/', authenticate, loginToken)

export default router;
