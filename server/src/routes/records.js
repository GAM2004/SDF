import { Router } from "express";
import { createInvoice, getAllRecords } from "../controllers/records.js";

const router = Router();
router.get('/sales/history', getAllRecords);
router.post('/sales/invoice', createInvoice);

export default router;