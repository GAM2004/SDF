import { Router } from "express";
import { registerReturn } from "../controllers/returnsController.js";

const router = Router();

router.post('/returns', registerReturn);

export default router;