import { connectionSQL, SQL, procedures } from "../db/index.js";

export const loginUser = async (req, res) => {
    const { nombre, clave } = req.body;
    console.log(`Intento de login para el usuario: ${nombre}`);

    if (!nombre || !clave) {
        return res.status(400).json({ msg: "Nombre y clave son requeridos" });
    }
    
    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request()
            .input('nombre', SQL.VarChar, nombre)
            .input('clave', SQL.VarChar, clave)
            .execute(procedures.loginUser);

        if (result.recordset.length === 0) {
            console.log(`Login fallido para: ${nombre}. Credenciales inválidas.`);
            return res.status(401).json({ msg: "Credenciales inválidas" });
        }
        
        console.log(`Login exitoso para: ${nombre}.`);
        res.json(result.recordset[0]);
    } catch (error) {
        console.error("Error en el controlador de login:", error.message);
        res.status(500).send({ msg: 'Error interno del servidor', error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const newUser = async (req, res) => {
    const { nombre, apellido, clave } = req.body;
    if (!nombre || !clave || !apellido) {
        return res.status(400).json({ msg: "Nombre, apellido y clave son requeridos" });
    }
    
    let pool;
    try {
        pool = await connectionSQL();
        await pool.request()
            .input('nombre', SQL.VarChar, nombre)
            .input('apellido', SQL.VarChar, apellido)
            .input('clave', SQL.VarChar, clave)
            .execute(procedures.insertUser);
        res.status(201).json({ msg: 'Usuario agregado' });
    } catch (error) {
        // Manejo de error para usuario duplicado
        if (error.message.includes('UNIQUE KEY')) {
             return res.status(409).send({ msg: 'Error al crear el usuario: El nombre de usuario ya existe.', error: error.message });
        }
        res.status(500).send({ msg: 'Error al crear el usuario', error: error.message });
    } finally {
        if (pool) pool.close();
    }
};