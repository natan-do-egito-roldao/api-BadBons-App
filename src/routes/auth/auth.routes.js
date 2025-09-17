import { Router } from 'express';
import { createAthlete } from '../../controllers/auth.controller.js';
import { login } from '../../controllers/auth.controller.js'
import { loginToken } from '../../controllers/auth.controller.js'
import { reAuth } from '../../middleware/reAuth.js'
import {logout} from '../../controllers/auth.controller.js'
import { authenticate } from '../../middleware/authenticate.js';

const   router = Router();

router.post('/', createAthlete);

router.post('/login', login)

router.post('/login-Token', authenticate, loginToken)

router.post('/logout', logout)

router.post('/reAuth', reAuth)

export default router;
