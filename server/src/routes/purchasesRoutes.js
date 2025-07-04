import { Router } from "express";
import { registerPurchase } from "../controllers/purchasesController.js";

const router = Router();

router.post('/purchases', registerPurchase);

export default router;