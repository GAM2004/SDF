import { connectionSQL, SQL, procedures } from "../db/index.js";

const getDateRangeReport = (procedureName, errorMessage) => async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;
    if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({ msg: "Las fechas de inicio y fin son requeridas." });
    }
    
    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request()
            .input('fecha_inicio', SQL.Date, fecha_inicio)
            .input('fecha_fin', SQL.Date, fecha_fin)
            .execute(procedureName);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(errorMessage, error);
        res.status(500).json({ msg: errorMessage, error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const getMostSold = getDateRangeReport(
    procedures.getMostSoldProducts, 
    "Error al obtener el reporte de productos más vendidos"
);

export const getGeneralSalesReport = async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;
    if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({ msg: "Las fechas de inicio y fin son requeridas." });
    }

    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request()
            .input('fecha_inicio', SQL.Date, fecha_inicio)
            .input('fecha_fin', SQL.Date, fecha_fin)
            .execute(procedures.getGeneralSalesReport);
        const data = result.recordset[0] || { totalRevenue: 0, numberOfSales: 0 };
        res.status(200).json(data); 
    } catch (error) {
        const errorMessage = "Error al obtener el reporte general de ventas";
        console.error(errorMessage, error);
        res.status(500).json({ msg: errorMessage, error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const getLowStock = async (req, res) => {
    const { limite } = req.query;
    if (!limite) {
        return res.status(400).json({ msg: "El límite de stock es requerido." });
    }

    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request()
            .input('limite_existencia', SQL.Int, limite)
            .execute(procedures.getLowStock);
        res.status(200).json(result.recordset);
    } catch (error) {
        const errorMessage = "Error al obtener el reporte de stock bajo";
        console.error(errorMessage, error);
        res.status(500).json({ msg: errorMessage, error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const getStockMovements = async (req, res) => {
    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request().execute(procedures.getStockMovements);
        res.status(200).json(result.recordset);
    } catch (error) {
        const errorMessage = "Error al obtener los movimientos de stock";
        console.error(errorMessage, error);
        res.status(500).json({ msg: errorMessage, error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const getSaleDateRange = async (req, res) => {
    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request().execute(procedures.getSaleDateRange);
        const data = result.recordset[0] || { minDate: null, maxDate: null };
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = "Error al obtener el rango de fechas de ventas";
        console.error(errorMessage, error);
        res.status(500).json({ msg: errorMessage, error: error.message });
    } finally {
        if (pool) pool.close();
    }
};