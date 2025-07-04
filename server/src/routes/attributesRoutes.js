import { Router } from "express";
import { getCategories, getSizes, getColors, createCategory, createSize, createColor } from "../controllers/attributesController.js";

const router = Router();
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.get('/sizes', getSizes);
router.post('/sizes', createSize);
router.get('/colors', getColors);
router.post('/colors', createColor);

export default router;