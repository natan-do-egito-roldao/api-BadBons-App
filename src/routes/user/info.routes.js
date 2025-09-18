import express from 'express';
import { alterInfo } from '../../controllers/user/info.controller.js';
import { authorize } from '../../middleware/authorize.js';
import { authenticate } from '../../middleware/authenticate.js';
import { alterImage } from '../../controllers/user/info.controller.js';
import { getQuantidadeTreinos } from '../../controllers/user/treinos.controller.js';

import multer from "multer";
const upload = multer({ dest: "uploads/" });


const router = express.Router();

router.patch('/update', authenticate, alterInfo);

router.patch('/update-image', authenticate, upload.single("fotoPerfil"), alterImage);

router.get('/treinos', authenticate, getQuantidadeTreinos);

export default router;

