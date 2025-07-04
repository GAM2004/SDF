import sql from "mssql";
import config from "../config.js";

const dbSettings = {
    user: config.db_user,
    password: config.db_password,
    server: config.db_server,
    database: config.db_database,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

export const connectionSQL = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
};

export const SQL = sql;