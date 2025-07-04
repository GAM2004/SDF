import { connectionSQL, SQL, procedures } from "./connection.js";

class Provider {
    static async _execute(procedure, inputs = []) {
        let pool;
        try {
            pool = await connectionSQL();
            if (!pool) throw new Error("No se pudo establecer conexión a la BD.");

            const request = pool.request();
            inputs.forEach(input => {
                request.input(input.name, input.type, input.value);
            });

            const result = await request.execute(procedure);
            return result;
        } catch (error) {
            console.error(`❌ Error en Model al ejecutar ${procedure}:`, error.message);
            throw new Error(`Error en la operación de proveedor: ${error.message}`);
        } finally {
            if (pool) pool.close();
        }
    }

    static async getAll() {
        const result = await this._execute(procedures.getAllProviders);
        return result.recordset;
    }

    static async getById(id) {
        const result = await this._execute(procedures.getProviderById, [{ name: 'id', type: SQL.Int, value: id }]);
        return result.recordset[0];
    }

    static async create({ name, email, phone }) {
        const inputs = [
            { name: 'nombre', type: SQL.VarChar, value: name },
            { name: 'email', type: SQL.VarChar, value: email },
            { name: 'telefono', type: SQL.VarChar, value: phone }
        ];
        await this._execute(procedures.insertProvider, inputs);
    }

    static async update({ id, name, email, phone }) {
        const inputs = [
            { name: 'id', type: SQL.Int, value: id },
            { name: 'nombre', type: SQL.VarChar, value: name },
            { name: 'email', type: SQL.VarChar, value: email },
            { name: 'telefono', type: SQL.VarChar, value: phone }
        ];
        await this._execute(procedures.updateProvider, inputs);
    }

    static async delete(id) {
        await this._execute(procedures.deleteProvider, [{ name: 'id', type: SQL.Int, value: id }]);
    }
}

export default Provider;