import express from "express";
import config from "./config.js";
import cors from "cors";
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import attributesRoutes from './routes/attributesRoutes.js'; 
import salesRoutes from './routes/records.js';
import reportRoutes from './routes/reportsRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import purchaseRoutes from './routes/purchasesRoutes.js';
import returnRoutes from './routes/returnsRoutes.js';

const app = express();
 
app.set('port', config.port || 3000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', attributesRoutes);
app.use('/api', salesRoutes);
app.use('/api', reportRoutes);
app.use('/api', providerRoutes);
app.use('/api', purchaseRoutes);
app.use('/api', returnRoutes);

export default app;