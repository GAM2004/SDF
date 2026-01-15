import axios from 'axios';

// --- CONFIGURACIÓN DINÁMICA ---
// Detecta automáticamente la IP o el host que estás usando en el navegador.
// Si entras por localhost, usa localhost. Si entras por IP (celular), usa la IP.
const hostname = window.location.hostname; 
const API_BASE_URL = `http://${hostname}:3000/api`;

console.log(`🔌 Conectando a la API en: ${API_BASE_URL}`);

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
export const deleteCategory = (id) => api.delete(`/categories/${id}`); // CRUD Completo
export const getSizes = () => api.get('/sizes');
export const createSize = (sizeData) => api.post('/sizes', sizeData);
export const deleteSize = (id) => api.delete(`/sizes/${id}`);       // CRUD Completo
export const getColors = () => api.get('/colors');
export const createColor = (colorData) => api.post('/colors', colorData);
export const deleteColor = (id) => api.delete(`/colors/${id}`);     // CRUD Completo

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
export const registerReturn = (returnData) => api.post('/returns', returnData);