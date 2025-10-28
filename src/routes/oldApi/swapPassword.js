import express from 'express';
import { alterInfo } from '../../controllers/user/info.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import multer from "multer";
import { authorize } from '../../middleware/authorize.js';  
const upload = multer({ dest: "uploads/" });


const router = express.Router();

router.patch('/', authenticate, authorize('ADM'), alterInfo);

export default router;

