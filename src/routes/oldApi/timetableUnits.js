import express from "express";
import { getAllUnits } from "../../controllers/unit.controller.js";

const router = express.Router();

router.get('/', getAllUnits)


export default router