import { Router } from 'express';
import { createAthlete } from '../../controllers/auth.controller.js';
import { login } from '../../controllers/auth.controller.js'
import { reAuth } from '../../middleware/reAuth.js'

const   router = Router();

router.post('/', createAthlete);

router.post('/login', login)

router.post('/reAuth', reAuth)

export default router;
