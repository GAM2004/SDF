import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000/api';
const api = axios.create({ baseURL: API_BASE_URL });

// --- Autenticación ---
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const createUser = (userData) => api.post('/users', userData);

// --- Productos ---
export const getProducts = () => api.get('/products');
export const getProductDetails = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const addProductImage = (productId, imageData) => api.post(`/products/${productId}/images`,imageData);
export const deleteProductImage = (imageId) => api.delete(`/images/${imageId}`);

// --- Inventario ---
export const addInventory = (inventoryData) => api.post('/products/inventory', inventoryData);

// --- Atributos (Categorías, Tallas, Colores) ---
export const getCategories = () => api.get('/categories');
export const createCategory = (categoryData) => api.post('/categories', categoryData);
export const getSizes = () => api.get('/sizes');
export const createSize = (sizeData) => api.post('/sizes', sizeData);
export const getColors = () => api.get('/colors');
export const createColor = (colorData) => api.post('/colors', colorData);

// --- Ventas (Facturas) ---
export const getRecords = () => api.get('/sales/history');
export const createInvoice = (invoiceData) => api.post('/sales/invoice', invoiceData);

// --- Reportes ---
export const getMostSoldReport = (params) => api.get('/reports/most-sold', { params });
export const getLowStockReport = (params) => api.get('/reports/low-stock', { params });
export const getStockMovements = () => api.get('/reports/stock-movements');
export const getGeneralSalesReport = (params) => api.get('/reports/general-sales', { params });
export const getSaleDateRange = () => api.get('/reports/sale-date-range');

// --- Proveedores y Compras ---
export const getProviders = () => api.get('/providers');
export const createProvider = (providerData) => api.post('/providers', providerData);
export const deleteProvider = (id) => api.delete(`/providers/${id}`);
export const registerPurchase = (purchaseData) => api.post('/purchases', purchaseData);