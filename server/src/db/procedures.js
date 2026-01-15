export const procedures = {
    // Usuarios
    loginUser: 'dbo.sp_LoginUser',
    insertUser: 'dbo.sp_InsertUser',
    // Productos e Inventario
    getAllProducts: 'dbo.sp_GetAllProducts',
    getProductDetails: 'dbo.sp_GetProductDetails',
    insertProduct: 'dbo.sp_InsertProduct',
    updateProduct: 'dbo.sp_UpdateProduct',
    deleteProduct: 'dbo.sp_DeleteProduct',
    addInventory: 'dbo.sp_AddInventory',
    insertImage: 'dbo.sp_InsertImage',
    deleteImage: 'dbo.sp_DeleteImage',
    
    // Atributos (CORRECCIÓN: Añadidos DELETE)
    getCategories: 'dbo.sp_GetCategorias',
    insertCategory: 'dbo.sp_InsertCategory',
    deleteCategory: 'dbo.sp_DeleteCategory', // Nuevo
    getSizes: 'dbo.sp_GetTallas',
    insertSize: 'dbo.sp_InsertTalla',
    deleteSize: 'dbo.sp_DeleteTalla', // Nuevo
    getColors: 'dbo.sp_GetColores',
    insertColor: 'dbo.sp_InsertColor',
    deleteColor: 'dbo.sp_DeleteColor', // Nuevo

    // Ventas y Compras
    createInvoice: 'dbo.sp_CrearFactura',
    getAllRecords: 'dbo.sp_GetAllRecords',
    registerPurchase: 'dbo.sp_RegisterPurchase',
    // CORRECCIÓN: Procedimiento de devoluciones añadido
    registerReturn: 'dbo.sp_RegisterReturn',
    // Reportes
    getMostSoldProducts: 'dbo.sp_GetMostSoldProducts',
    getLowStock: 'dbo.sp_GetLowStock',
    getStockMovements: 'dbo.sp_GetStockMovements',
    getGeneralSalesReport: 'dbo.sp_GetGeneralSalesReport',
    getSaleDateRange: 'dbo.sp_GetSaleDateRange',
    // Proveedores
    getAllProviders: 'dbo.sp_GetAllProveedores',
    getProviderById: 'dbo.sp_GetProveedorById',
    insertProvider: 'dbo.sp_InsertProveedor',
    updateProvider: 'dbo.sp_UpdateProveedor',
    deleteProvider: 'dbo.sp_DeleteProveedor',
};