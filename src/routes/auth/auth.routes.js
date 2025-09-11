import { Router } from 'express';
import { createAthlete } from '../../controllers/auth.controller.js';
import { login } from '../../controllers/auth.controller.js'

const   router = Router();

router.post('/', createAthlete);

router.post('/login', login)

export default router;
