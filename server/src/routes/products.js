import { Router } from "express";
import { 
    getProducts, 
    getProductDetails, 
    newProduct, 
    updateProduct, 
    deleteProduct, 
    addInventory, 
    addImage,
    deleteImage,
    getDeletedProducts, // <--- Importar
    restoreProduct      // <--- Importar
} from "../controllers/products.js";

const router = Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductDetails);
router.post('/products', newProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/inventory', addInventory);
router.post('/products/:id/images', addImage);
router.delete('/images/:id', deleteImage);
router.get('/products/deleted', getDeletedProducts);
router.put('/products/restore/:id', restoreProduct);

export default router;