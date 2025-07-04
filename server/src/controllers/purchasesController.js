import { connectionSQL, SQL, procedures } from "../db";

export const registerPurchase = async (req, res) => {
    const { proveedor_id, total_compra, detalle, id_usuario } = req.body;
    if (!proveedor_id || !total_compra || !detalle || !Array.isArray(detalle) || detalle.length === 0 || !id_usuario) {
        return res.status(400).json({ msg: "Datos de compra incompletos o en formato incorrecto." });
    }

    let detalleXml = '<items>';
    detalle.forEach(item => {
        detalleXml += `<item inventario_id="${item.inventario_id}" cantidad="${item.cantidad}" costo_unitario="${item.costo_unitario}" />`;
    });
    detalleXml += '</items>';

    let connection;
    try {
        connection = await connectionSQL();
        await connection.request()
            .input('proveedor_id', SQL.Int, proveedor_id)
            .input('total_compra', SQL.Money, total_compra)
            .input('id_usuario', SQL.Int, id_usuario)
            .input('detalle_compra', SQL.Xml, detalleXml)
            .execute(procedures.registerPurchase);
        res.status(201).json({ msg: "Compra registrada y stock actualizado con éxito." });
    } catch (error) {
        console.error("Error en registerPurchase:", error);
        res.status(500).json({ msg: "Error al registrar la compra", error: error.message });
    } finally {
        if (connection) connection.close();
    }
};