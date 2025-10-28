import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { alterImage } from '../../controllers/user/info.controller.js';
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.patch('/', authenticate, upload.single("fotoPerfil"), alterImage);

export default router;

