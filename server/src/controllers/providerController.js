import { connectionSQL, SQL, procedures } from "../db/index.js";

export const getAllProviders = async (req, res) => {
    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request().execute(procedures.getAllProviders);
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener proveedores', error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const getProviderById = async (req, res) => {
    const { id } = req.params;
    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request()
            .input('id', SQL.Int, id)
            .execute(procedures.getProviderById);
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Proveedor no encontrado' });
        }
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el proveedor', error: error.message });
    } finally {
        if (pool) pool.close();
    }
};
export const createProvider = async (req, res) => {
    const { nombre, email, telefono } = req.body;
    if (!nombre) {
        return res.status(400).json({ msg: 'El nombre del proveedor es obligatorio.' });
    }
    let pool;
    try {
        pool = await connectionSQL();
        await pool.request()
            .input('nombre', SQL.VarChar, nombre)
            .input('email', SQL.VarChar, email)
            .input('telefono', SQL.VarChar, telefono)
            .execute(procedures.insertProvider);
        res.status(201).json({ msg: 'Proveedor creado con éxito' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el proveedor', error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const updateProvider = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono } = req.body;
    if (!nombre) {
        return res.status(400).json({ msg: 'El nombre es obligatorio.' });
    }
    let pool;
    try {
        pool = await connectionSQL();
        await pool.request()
            .input('id', SQL.Int, id)
            .input('nombre', SQL.VarChar, nombre)
            .input('email', SQL.VarChar, email)
            .input('telefono', SQL.VarChar, telefono)
            .execute(procedures.updateProvider);
        res.status(200).json({ msg: 'Proveedor actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el proveedor', error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const deleteProvider = async (req, res) => {
    const { id } = req.params;
    let pool;
    try {
        pool = await connectionSQL();
        await pool.request()
            .input('id', SQL.Int, id)
            .execute(procedures.deleteProvider);
        res.status(200).json({ msg: 'Proveedor eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el proveedor', error: error.message });
    } finally {
        if (pool) pool.close();
    }
};