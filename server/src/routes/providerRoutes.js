import { Router } from 'express';
import {
    getAllProviders,
    getProviderById,
    createProvider,
    updateProvider,
    deleteProvider
} from '../controllers/providerController.js';

const router = Router();

router.get('/providers', getAllProviders);
router.get('/providers/:id', getProviderById);
router.post('/providers', createProvider);
router.put('/providers/:id', updateProvider);
router.delete('/providers/:id', deleteProvider);

export default router;