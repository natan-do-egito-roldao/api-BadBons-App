import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { getAllUnits } from "../../controllers/unit.controller.js";
import { getUnit} from "../../controllers/unit.controller.js";
import { tagDay }  from "../../controllers/unit.controller.js";
import { viewTagDays }  from "../../controllers/unit.controller.js";
import { confirmPresence }  from "../../controllers/unit.controller.js";

const router = express.Router()

router.get('/', getAllUnits)


export default router