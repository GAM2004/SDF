import { connectionSQL, SQL, procedures } from "../db/index.js";
export const registerReturn = async (req, res) => {
    const { venta_id, cantidad_devuelta, motivo, id_usuario } = req.body;
    if (!venta_id || !cantidad_devuelta || !id_usuario) {
        return res.status(400).json({ msg: "Datos de devolución incompletos." });
    }

    let connection;
    try {
        connection = await connectionSQL();
        await connection.request()
            .input('venta_id', SQL.Int, venta_id)
            .input('cantidad_devuelta', SQL.Int, cantidad_devuelta)
            .input('motivo', SQL.Text, motivo)
            .input('id_usuario', SQL.Int, id_usuario)
            .execute(procedures.registerReturn);

        res.status(201).json({ msg: "Devolución registrada y stock reintegrado." });
    } catch (error) {
        console.error("Error en registerReturn:", error);
        res.status(500).json({ msg: "Error al registrar la devolución.", error: error.message });
    } finally {
        if (connection) connection.close();
    }
};