import { Router } from "express";
import { 
    getMostSold, 
    getLowStock, 
    getStockMovements,
    getGeneralSalesReport,
    getSaleDateRange
} from "../controllers/reportsController.js";

const router = Router();
router.get('/reports/most-sold', getMostSold);
router.get('/reports/low-stock', getLowStock);
router.get('/reports/stock-movements', getStockMovements);
router.get('/reports/general-sales', getGeneralSalesReport);
router.get('/reports/sale-date-range', getSaleDateRange);

export default router;