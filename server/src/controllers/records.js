import { connectionSQL, SQL, procedures } from "../db/index.js";

export const createInvoice = async (req, res) => {
    const { id_usuario, cliente_nombre, detalle_venta } = req.body;
    if (!id_usuario || !detalle_venta || !Array.isArray(detalle_venta) || detalle_venta.length === 0) {
        return res.status(400).json({ msg: "Datos de factura incompletos o incorrectos." });
    }
    
    let detalleXml = '<items>';
    detalle_venta.forEach(item => {
        detalleXml += `<item inventario_id="${item.inventario_id}" cantidad="${item.cantidad}" />`;
    });
    detalleXml += '</items>';

    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request()
            .input('id_usuario', SQL.Int, id_usuario)
            .input('cliente_nombre', SQL.VarChar, cliente_nombre)
            .input('detalle_venta', SQL.Xml, detalleXml)
            .execute(procedures.createInvoice);
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ msg: "Error al crear la factura", error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const getAllRecords = async (req, res) => {
    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request().execute(procedures.getAllRecords);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send({ msg: "Error al obtener el historial de ventas.", error: error.message });
    } finally {
        if (pool) pool.close();
    }
};