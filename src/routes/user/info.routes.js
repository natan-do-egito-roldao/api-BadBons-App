import express from 'express';
import { alterInfo } from '../../controllers/user/info.controller.js';
import { authorize } from '../../middleware/authorize.js';
import { authenticate } from '../../middleware/authenticate.js';
import { alterImage } from '../../controllers/user/info.controller.js';
import multer from "multer";
const upload = multer({ dest: "uploads/" });


const router = express.Router();

router.patch('/update', authenticate, alterInfo);

router.patch('/update-image', authenticate, upload.single("fotoPerfil"), alterImage);

export default router;