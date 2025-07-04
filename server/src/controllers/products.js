import { connectionSQL, SQL, procedures } from "../db/index.js";

export const getProducts = async (req, res) => {
    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request().execute(procedures.getAllProducts);
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los productos", error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const getProductDetails = async (req, res) => {
    const { id } = req.params;
    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request()
            .input('product_id', SQL.Int, id)
            .execute(procedures.getProductDetails);
        if (result.recordsets[0].length === 0) {
            return res.status(404).json({ msg: "Producto no encontrado." });
        }

        const productDetails = result.recordsets[0][0];
        productDetails.imagenes = result.recordsets[1];
        productDetails.inventario = result.recordsets[2];

        res.status(200).json(productDetails);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los detalles del producto", error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const newProduct = async (req, res) => {
    const { codigo_producto, nombre, descripcion, precio, proveedor_id, categoria_id } = req.body;

    if (!nombre || !precio || !categoria_id) {
        return res.status(400).json({ msg: "Nombre, precio y categoría son obligatorios." });
    }
    
    let pool;
    try {
        pool = await connectionSQL();
        const result = await pool.request()
            .input('code', SQL.VarChar, codigo_producto)
            .input('name', SQL.VarChar, nombre)
            .input('desc', SQL.Text, descripcion)
            .input('price', SQL.Money, precio)
            .input('proveedor_id', SQL.Int, proveedor_id)
            .input('categoria_id', SQL.Int, categoria_id)
            .execute(procedures.insertProduct);

        res.status(201).json({ msg: "Producto creado con éxito", newProductId: result.recordset[0].new_product_id });
    } catch (error) {
        res.status(500).json({ msg: "Error al crear el producto", error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { codigo_producto, nombre, descripcion, precio, proveedor_id, categoria_id } = req.body;

    if (!nombre || !precio || !categoria_id) {
        return res.status(400).json({ msg: "Nombre, precio y categoría son obligatorios." });
    }

    let pool;
    try {
        pool = await connectionSQL();
        await pool.request()
            .input('id', SQL.Int, id)
            .input('codigo_producto', SQL.VarChar, codigo_producto)
            .input('nombre', SQL.VarChar, nombre)
            .input('descripcion', SQL.Text, descripcion)
            .input('precio', SQL.Money, precio)
            .input('proveedor_id', SQL.Int, proveedor_id)
            .input('categoria_id', SQL.Int, categoria_id)
            .execute(procedures.updateProduct);
        
        res.status(200).json({ msg: "Producto actualizado correctamente." });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el producto", error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const addInventory = async (req, res) => {
    const { producto_id, talla_id, color_id, cantidad, id_usuario } = req.body;
    
    if (!producto_id || !talla_id || !color_id || !id_usuario || cantidad === undefined) {
        return res.status(400).json({ msg: "Datos de inventario incompletos." });
    }

    let pool;
    try {
        pool = await connectionSQL();
        await pool.request()
            .input('producto_id', SQL.Int, producto_id)
            .input('talla_id', SQL.Int, talla_id)
            .input('color_id', SQL.Int, color_id)
            .input('cantidad', SQL.Int, cantidad)
            .input('id_usuario', SQL.Int, id_usuario)
            .execute(procedures.addInventory);
        
        res.status(201).json({ msg: "Stock actualizado con éxito." });
    } catch (error) {
        res.status(500).json({ msg: "Error al añadir inventario", error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const addImage = async (req, res) => {
    const { id } = req.params;
    const { url_imagen } = req.body;
    
    if (!url_imagen) {
        return res.status(400).json({ msg: "La URL de la imagen es obligatoria." });
    }

    let pool;
    try {
        pool = await connectionSQL();
        await pool.request()
            .input('producto_id', SQL.Int, id)
            .input('url_imagen', SQL.VarChar, url_imagen)
            .execute(procedures.insertImage);
        
        res.status(201).json({ msg: "Imagen añadida con éxito." });
    } catch (error) {
        res.status(500).json({ msg: "Error al añadir la imagen", error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    let pool;
    try {
        pool = await connectionSQL();
        await pool.request().input('id', SQL.Int, id).execute(procedures.deleteProduct);
        res.status(200).json({ msg: "Producto eliminado correctamente." });
    } catch (error) { 
        res.status(500).json({ msg: "Error al eliminar el producto", error: error.message });
    } finally { 
        if (pool) pool.close(); 
    }
};

export const deleteImage = async (req, res) => {
    const { id } = req.params;
    let pool;
    try {
        pool = await connectionSQL();
        await pool.request()
            .input('id', SQL.Int, id)
            .execute(procedures.deleteImage);
        res.status(200).json({ msg: "Imagen eliminada correctamente." });
    } catch (error) { 
        res.status(500).json({ msg: "Error al eliminar la imagen", error: error.message });
    } finally { 
        if (pool) pool.close(); 
    }
};