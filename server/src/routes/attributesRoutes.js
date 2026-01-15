import { Router } from "express";
import { 
    // Categorias
    getCategories, 
    getDeletedCategories,
    createCategory, 
    deleteCategory, 
    restoreCategory,

    // Tallas
    getSizes, 
    getDeletedSizes,
    createSize, 
    deleteSize, 
    restoreSize,

    // Colores
    getColors, 
    getDeletedColors,
    createColor,
    deleteColor,
    restoreColor
} from "../controllers/attributesController.js";

const router = Router();

// ============ Categorías ============
router.get('/categories', getCategories);
router.get('/categories/deleted', getDeletedCategories); // Ver papelera
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);        // Mover a papelera
router.put('/categories/restore/:id', restoreCategory);  // Restaurar

// ============ Tallas (Sizes) ============
router.get('/sizes', getSizes);
router.get('/sizes/deleted', getDeletedSizes);           // Ver papelera
router.post('/sizes', createSize);
router.delete('/sizes/:id', deleteSize);                 // Mover a papelera
router.put('/sizes/restore/:id', restoreSize);           // Restaurar

// ============ Colores ============
router.get('/colors', getColors);
router.get('/colors/deleted', getDeletedColors);         // Ver papelera
router.post('/colors', createColor);
router.delete('/colors/:id', deleteColor);               // Mover a papelera
router.put('/colors/restore/:id', restoreColor);         // Restaurar

export default router;