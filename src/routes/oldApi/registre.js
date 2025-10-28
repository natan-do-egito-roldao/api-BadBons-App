import { Router } from 'express';
import { createAthlete } from '../../controllers/auth.controller.js';

const   router = Router();

router.post('/', createAthlete);

export default router;
