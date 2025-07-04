import { connectionSQL, SQL, procedures } from "../db/index.js";

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

export const getCategories = getGenericAttribute('categorias', procedures.getCategories);
export const getSizes = getGenericAttribute('tallas', procedures.getSizes);
export const getColors = getGenericAttribute('colores', procedures.getColors);

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

export const createCategory = createGenericAttribute('categoría', procedures.insertCategory);
export const createSize = createGenericAttribute('talla', procedures.insertSize);
export const createColor = createGenericAttribute('color', procedures.insertColor);