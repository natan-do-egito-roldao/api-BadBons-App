import express from "express";
import { createUnit } from "../../controllers/admin/unit.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { getAllUnits } from "../../controllers/unit.controller.js";

const router = express.Router()

router.patch('/', authenticate, authorize('ADM'), createUnit)
router.get('/', getAllUnits)

export default router