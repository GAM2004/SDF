import { connectionSQL, SQL } from "../db/index.js";

// =====================================================================
// 1. FUNCIONES GENÉRICAS (El motor de tu controlador)
// =====================================================================

// Obtener activos
const getGenericAttribute = (tableName, procedureName) => async (req, res) => {
    let connection;
    try {
        connection = await connectionSQL();
        const result = await connection.request().execute(procedureName);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ msg: `Error al obtener ${tableName}`, error: error.message });
    } finally {
        if (connection) connection.close();
    }
};

// NUEVO: Obtener eliminados (Papelera)
const getDeletedGenericAttribute = (tableName, procedureName) => async (req, res) => {
    let connection;
    try {
        connection = await connectionSQL();
        const result = await connection.request().execute(procedureName);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ msg: `Error al obtener papelera de ${tableName}`, error: error.message });
    } finally {
        if (connection) connection.close();
    }
};

// Crear
const createGenericAttribute = (tableName, procedureName) => async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ msg: `El nombre de ${tableName} es obligatorio.` });
    }
    
    let connection;
    try {
        connection = await connectionSQL();
        await connection.request()
            .input('nombre', SQL.VarChar, nombre)
            .execute(procedureName);
        res.status(201).json({ msg: `${tableName} creado con éxito` });
    } catch (error) {
        res.status(500).json({ msg: `Error al crear ${tableName}`, error: error.message });
    } finally {
        if (connection) connection.close();
    }
};

// Eliminar (Soft Delete - Mueve a papelera)
const deleteGenericAttribute = (tableName, procedureName) => async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await connectionSQL();
        await connection.request()
            .input('id', SQL.Int, id)
            .execute(procedureName);
            
        res.status(200).json({ msg: `${tableName} movido a la papelera.` });
    } catch (error) {
        // Manejar errores si SQL falla
        res.status(500).json({ msg: `Error al eliminar ${tableName}`, error: error.message });
    } finally {
        if (connection) connection.close();
    }
};

// NUEVO: Restaurar
const restoreGenericAttribute = (tableName, procedureName) => async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await connectionSQL();
        await connection.request()
            .input('id', SQL.Int, id)
            .execute(procedureName);
            
        res.status(200).json({ msg: `${tableName} restaurado con éxito.` });
    } catch (error) {
        res.status(500).json({ msg: `Error al restaurar ${tableName}`, error: error.message });
    } finally {
        if (connection) connection.close();
    }
};

// =====================================================================
// 2. EXPORTACIONES (Conectando con los SP de tu Base de Datos)
// =====================================================================

// --- Categorías ---
export const getCategories = getGenericAttribute('categorías', 'sp_GetCategorias');
export const getDeletedCategories = getDeletedGenericAttribute('categorías', 'sp_GetDeletedCategories');
export const createCategory = createGenericAttribute('categoría', 'sp_InsertCategory');
export const deleteCategory = deleteGenericAttribute('categoría', 'sp_DeleteCategory');
export const restoreCategory = restoreGenericAttribute('categoría', 'sp_RestoreCategory');

// --- Tallas (Sizes) ---
export const getSizes = getGenericAttribute('tallas', 'sp_GetTallas');
export const getDeletedSizes = getDeletedGenericAttribute('tallas', 'sp_GetDeletedTallas');
export const createSize = createGenericAttribute('talla', 'sp_InsertTalla');
export const deleteSize = deleteGenericAttribute('talla', 'sp_DeleteTalla');
export const restoreSize = restoreGenericAttribute('talla', 'sp_RestoreTalla');

// --- Colores ---
export const getColors = getGenericAttribute('colores', 'sp_GetColores');
export const getDeletedColors = getDeletedGenericAttribute('colores', 'sp_GetDeletedColores');
export const createColor = createGenericAttribute('color', 'sp_InsertColor');
export const deleteColor = deleteGenericAttribute('color', 'sp_DeleteColor');
export const restoreColor = restoreGenericAttribute('color', 'sp_RestoreColor');