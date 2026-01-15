USE [master]
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'SFD')
BEGIN
    ALTER DATABASE [SFD] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [SFD];
END
GO

CREATE DATABASE [SFD];
GO

ALTER DATABASE [SFD] SET COMPATIBILITY_LEVEL = 160;
GO

USE [SFD]
GO

-- ================================================================================
-- TABLAS
-- ================================================================================
CREATE TABLE [dbo].[usuarios](
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [nombre] [varchar](255) UNIQUE NOT NULL,
    [apellido] [varchar](255) NULL,
    [clave] [varchar](255) NOT NULL
);

CREATE TABLE [dbo].[proveedores] (
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [nombre] [varchar](255) NOT NULL,
    [email] [varchar](255) UNIQUE,
    [telefono] [varchar](20)
);

CREATE TABLE [dbo].[categorias] (
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [nombre] [varchar](100) NOT NULL UNIQUE
);

CREATE TABLE [dbo].[tallas] (
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [nombre] [varchar](50) NOT NULL UNIQUE
);

CREATE TABLE [dbo].[colores] (
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [nombre] [varchar](50) NOT NULL UNIQUE
);

CREATE TABLE [dbo].[productos](
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [codigo_producto] [varchar](255) NULL UNIQUE,
    [nombre] [varchar](255) NOT NULL,
    [descripcion] [text] NULL,
    [precio] [money] NOT NULL,
    [proveedor_id] [int] NULL,
    [categoria_id] [int] NULL,
    [fecha_creacion] [datetime] NOT NULL DEFAULT GETDATE(),
    [activo] [bit] NOT NULL DEFAULT 1, -- NUEVO: Campo para Soft Delete
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE [dbo].[imagenes_producto] (
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [producto_id] [int] NOT NULL,
    [url_imagen] [varchar](500) NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE [dbo].[inventario] (
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [producto_id] [int] NOT NULL,
    [talla_id] [int] NOT NULL,
    [color_id] [int] NOT NULL,
    [existencia] [int] NOT NULL CHECK (existencia >= 0),
    UNIQUE (producto_id, talla_id, color_id),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (talla_id) REFERENCES tallas(id),
    FOREIGN KEY (color_id) REFERENCES colores(id)
);

CREATE TABLE [dbo].[facturas] (
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [fecha_creacion] [datetime] NOT NULL DEFAULT GETDATE(),
    [id_usuario] [int] NOT NULL,
    [total_factura] [money] NOT NULL,
    [cliente_nombre] [varchar](255) NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE [dbo].[registro_ventas](
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [factura_id] [int] NOT NULL,
    [inventario_id] [int] NOT NULL,
    [cantidad] [int] NOT NULL,
    [precio_unitario] [money] NOT NULL,
    [total_linea] AS ([cantidad] * [precio_unitario]),
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE,
    FOREIGN KEY (inventario_id) REFERENCES inventario(id)
);

CREATE TABLE [dbo].[registro_compras](
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [proveedor_id] [int] NOT NULL,
    [fecha_compra] [datetime] NOT NULL DEFAULT GETDATE(),
    [total_compra] [money] NOT NULL,
    [id_usuario] [int] NOT NULL,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE [dbo].[detalle_compras](
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [compra_id] [int] NOT NULL,
    [inventario_id] [int] NOT NULL,
    [cantidad] [int] NOT NULL,
    [costo_unitario] [money] NOT NULL,
    FOREIGN KEY (compra_id) REFERENCES registro_compras(id) ON DELETE CASCADE,
    FOREIGN KEY (inventario_id) REFERENCES inventario(id)
);

CREATE TABLE [dbo].[movimientos_stock](
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [inventario_id] [int] NOT NULL,
    [fecha] [datetime] NOT NULL DEFAULT GETDATE(),
    [tipo_movimiento] [varchar](50) NOT NULL,
    [cantidad] [int] NOT NULL,
    [id_usuario] [int] NOT NULL,
    [referencia_id] [int] NULL,
    FOREIGN KEY (inventario_id) REFERENCES inventario(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE [dbo].[devoluciones](
    [id] [int] IDENTITY(1,1) PRIMARY KEY,
    [venta_id] [int] NOT NULL, 
    [fecha_devolucion] [datetime] NOT NULL DEFAULT GETDATE(),
    [cantidad_devuelta] [int] NOT NULL,
    [motivo] [text] NULL,
    [id_usuario] [int] NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES registro_ventas(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
GO

-- ================================================================================
-- PROCEDIMIENTOS ALMACENADOS
-- ================================================================================

-- Usuarios
CREATE PROCEDURE [dbo].[sp_LoginUser] @nombre VARCHAR(255), @clave VARCHAR(255) AS BEGIN SELECT id, nombre, apellido FROM usuarios WHERE nombre = @nombre AND clave = @clave; END
GO
CREATE PROCEDURE [dbo].sp_InsertUser @nombre VARCHAR(255), @apellido VARCHAR(255), @clave VARCHAR(255) AS BEGIN INSERT INTO usuarios (nombre, apellido, clave) VALUES (@nombre, @apellido, @clave); END
GO

-- Atributos (CRUD)
CREATE PROCEDURE [dbo].[sp_GetCategorias] AS BEGIN SELECT id, nombre FROM categorias ORDER BY nombre; END
GO
CREATE PROCEDURE [dbo].[sp_InsertCategory] @nombre VARCHAR(100) AS BEGIN INSERT INTO categorias (nombre) VALUES (@nombre); END
GO
CREATE PROCEDURE [dbo].[sp_DeleteCategory] @id INT AS BEGIN DELETE FROM categorias WHERE id = @id; END
GO

CREATE PROCEDURE [dbo].[sp_GetTallas] AS BEGIN SELECT id, nombre FROM tallas ORDER BY nombre; END
GO
CREATE PROCEDURE [dbo].[sp_InsertTalla] @nombre VARCHAR(50) AS BEGIN INSERT INTO tallas (nombre) VALUES (@nombre); END
GO
CREATE PROCEDURE [dbo].[sp_DeleteTalla] @id INT AS BEGIN DELETE FROM tallas WHERE id = @id; END
GO

CREATE PROCEDURE [dbo].[sp_GetColores] AS BEGIN SELECT id, nombre FROM colores ORDER BY nombre; END
GO
CREATE PROCEDURE [dbo].[sp_InsertColor] @nombre VARCHAR(50) AS BEGIN INSERT INTO colores (nombre) VALUES (@nombre); END
GO
CREATE PROCEDURE [dbo].[sp_DeleteColor] @id INT AS BEGIN DELETE FROM colores WHERE id = @id; END
GO

-- Productos e Inventario
-- MODIFICADO: Solo trae productos activos
CREATE PROCEDURE [dbo].[sp_GetAllProducts] 
AS 
BEGIN 
    SELECT 
        p.id, 
        p.nombre, 
        p.precio, 
        (SELECT TOP 1 url_imagen FROM imagenes_producto WHERE producto_id = p.id) as img, 
        (SELECT ISNULL(SUM(existencia), 0) FROM inventario WHERE producto_id = p.id) as stock_total 
    FROM productos p
    WHERE p.activo = 1; 
END
GO

CREATE PROCEDURE [dbo].[sp_GetProductDetails] @product_id INT AS BEGIN SELECT * FROM productos WHERE id = @product_id; SELECT id, url_imagen FROM imagenes_producto WHERE producto_id = @product_id; SELECT i.id as inventario_id, t.nombre as talla, c.nombre as color, i.existencia, i.talla_id, i.color_id FROM inventario i JOIN tallas t ON i.talla_id = t.id JOIN colores c ON i.color_id = c.id WHERE i.producto_id = @product_id; END
GO

CREATE PROCEDURE [dbo].[sp_InsertProduct] @code VARCHAR(255), @name VARCHAR(255), @desc TEXT, @price MONEY, @proveedor_id INT, @categoria_id INT AS BEGIN INSERT INTO productos (codigo_producto, nombre, descripcion, precio, proveedor_id, categoria_id) VALUES (@code, @name, @desc, @price, @proveedor_id, @categoria_id); SELECT SCOPE_IDENTITY() as new_product_id; END
GO

CREATE PROCEDURE [dbo].[sp_UpdateProduct] @id INT, @codigo_producto VARCHAR(255), @nombre VARCHAR(255), @descripcion TEXT, @precio MONEY, @proveedor_id INT, @categoria_id INT AS BEGIN UPDATE productos SET codigo_producto = @codigo_producto, nombre = @nombre, descripcion = @descripcion, precio = @precio, proveedor_id = @proveedor_id, categoria_id = @categoria_id WHERE id = @id; END
GO

-- MODIFICADO: Soft Delete en lugar de Delete físico
CREATE PROCEDURE [dbo].[sp_DeleteProduct] 
    @id INT 
AS 
BEGIN 
    UPDATE productos 
    SET activo = 0 
    WHERE id = @id; 
END
GO

-- NUEVO: Obtener productos eliminados (Papelera)
CREATE PROCEDURE [dbo].[sp_GetDeletedProducts]
AS
BEGIN
    SELECT 
        p.id, 
        p.nombre, 
        p.precio, 
        (SELECT TOP 1 url_imagen FROM imagenes_producto WHERE producto_id = p.id) as img, 
        (SELECT ISNULL(SUM(existencia), 0) FROM inventario WHERE producto_id = p.id) as stock_total 
    FROM productos p
    WHERE p.activo = 0;
END
GO

-- NUEVO: Restaurar producto
CREATE PROCEDURE [dbo].[sp_RestoreProduct]
    @id INT
AS
BEGIN
    UPDATE productos
    SET activo = 1
    WHERE id = @id;
END
GO

CREATE PROCEDURE [dbo].[sp_InsertImage] @producto_id INT, @url_imagen VARCHAR(500) AS BEGIN INSERT INTO imagenes_producto (producto_id, url_imagen) VALUES (@producto_id, @url_imagen); END
GO
CREATE PROCEDURE [dbo].[sp_DeleteImage] @id INT AS BEGIN DELETE FROM imagenes_producto WHERE id = @id; END
GO
CREATE PROCEDURE [dbo].[sp_AddInventory] @producto_id INT, @talla_id INT, @color_id INT, @cantidad INT, @id_usuario INT AS BEGIN SET NOCOUNT ON; DECLARE @inventario_id INT; DECLARE @movimiento_tipo VARCHAR(50) = 'entrada manual'; DECLARE @cantidad_real_movimiento INT = @cantidad; SELECT @inventario_id = id FROM inventario WHERE producto_id = @producto_id AND talla_id = @talla_id AND color_id = @color_id; IF @inventario_id IS NOT NULL BEGIN UPDATE inventario SET existencia = existencia + @cantidad WHERE id = @inventario_id; END ELSE BEGIN INSERT INTO inventario (producto_id, talla_id, color_id, existencia) VALUES (@producto_id, @talla_id, @color_id, @cantidad); SET @inventario_id = SCOPE_IDENTITY(); END INSERT INTO movimientos_stock (inventario_id, fecha, tipo_movimiento, cantidad, id_usuario) VALUES (@inventario_id, GETDATE(), @movimiento_tipo, @cantidad_real_movimiento, @id_usuario); END
GO

-- ================================================================================
-- VENTA
-- ================================================================================
IF OBJECT_ID('dbo.sp_CrearFactura', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_CrearFactura;
GO

CREATE PROCEDURE [dbo].[sp_CrearFactura]
    @id_usuario INT,
    @cliente_nombre VARCHAR(255),
    @detalle_venta XML
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @items_a_vender TABLE (
        inventario_id INT,
        cantidad_solicitada INT,
        existencia_actual INT,
        nombre_producto VARCHAR(255)
    );

    INSERT INTO @items_a_vender (inventario_id, cantidad_solicitada, existencia_actual, nombre_producto)
    SELECT
        T.item.value('@inventario_id', 'int'),
        T.item.value('@cantidad', 'int'),
        i.existencia,
        p.nombre
    FROM @detalle_venta.nodes('/items/item') AS T(item)
    JOIN inventario i ON T.item.value('@inventario_id', 'int') = i.id
    JOIN productos p ON i.producto_id = p.id;

    IF EXISTS (SELECT 1 FROM @items_a_vender WHERE cantidad_solicitada > existencia_actual)
    BEGIN
        DECLARE @error_msg VARCHAR(MAX);
        SELECT @error_msg = STRING_AGG(
            'Stock insuficiente para: ' + nombre_producto + 
            '. Solicitado: ' + CAST(cantidad_solicitada AS VARCHAR) + 
            ', Disponible: ' + CAST(existencia_actual AS VARCHAR), '; '
        )
        FROM @items_a_vender WHERE cantidad_solicitada > existencia_actual;

        THROW 51000, @error_msg, 1;
        RETURN;
    END

    BEGIN TRAN;
    BEGIN TRY
        DECLARE @factura_id INT;
        DECLARE @total_factura MONEY;

        SELECT @total_factura = ISNULL(SUM(v.cantidad_solicitada * p.precio), 0)
        FROM @items_a_vender v
        JOIN inventario i ON v.inventario_id = i.id
        JOIN productos p ON i.producto_id = p.id;

        INSERT INTO facturas (id_usuario, cliente_nombre, total_factura)
        VALUES (@id_usuario, @cliente_nombre, @total_factura);

        SET @factura_id = SCOPE_IDENTITY();

        INSERT INTO registro_ventas (factura_id, inventario_id, cantidad, precio_unitario)
        SELECT
            @factura_id,
            v.inventario_id,
            p.precio,
            p.precio
        FROM @items_a_vender v
        JOIN inventario i ON v.inventario_id = i.id
        JOIN productos p ON i.producto_id = p.id;

        UPDATE i
        SET i.existencia = i.existencia - v.cantidad_solicitada
        FROM inventario i
        JOIN @items_a_vender v ON i.id = v.inventario_id;

        INSERT INTO movimientos_stock (inventario_id, fecha, tipo_movimiento, cantidad, id_usuario, referencia_id)
        SELECT
            v.inventario_id,
            GETDATE(),
            'salida por venta',
            -v.cantidad_solicitada,
            @id_usuario,
            @factura_id
        FROM @items_a_vender v;

        COMMIT TRAN;

        SELECT @factura_id AS nueva_factura_id;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;
        THROW;
    END CATCH
END
GO

-- ================================================================================
-- REPORTE GENERAL
-- ================================================================================
CREATE PROCEDURE [dbo].[sp_GetAllRecords] AS 
BEGIN 
    SELECT 
        f.id AS factura_id, 
        f.fecha_creacion, 
        ISNULL(f.cliente_nombre, 'N/A') AS cliente_nombre, 
        u.nombre AS nombre_usuario, 
        p.nombre AS nombre_producto, 
        t.nombre AS talla, 
        c.nombre AS color, 
        rv.cantidad, 
        rv.precio_unitario, 
        rv.total_linea 
    FROM registro_ventas rv 
    JOIN facturas f ON rv.factura_id = f.id 
    JOIN inventario i ON rv.inventario_id = i.id 
    JOIN productos p ON i.producto_id = p.id 
    JOIN tallas t ON i.talla_id = t.id 
    JOIN colores c ON i.color_id = c.id 
    JOIN usuarios u ON f.id_usuario = u.id 
    ORDER BY f.fecha_creacion DESC; 
END
GO

-- Proveedores (CRUD)
CREATE PROCEDURE [dbo].[sp_GetAllProveedores] AS BEGIN SELECT * FROM proveedores; END
GO
CREATE PROCEDURE [dbo].[sp_GetProveedorById] @id INT AS BEGIN SELECT * FROM proveedores WHERE id=@id; END
GO
CREATE PROCEDURE [dbo].[sp_InsertProveedor] @nombre VARCHAR(255), @email VARCHAR(255), @telefono VARCHAR(20) AS BEGIN INSERT INTO proveedores(nombre, email, telefono) VALUES (@nombre, @email, @telefono); END
GO
CREATE PROCEDURE [dbo].[sp_UpdateProveedor] @id INT, @nombre VARCHAR(255), @email VARCHAR(255), @telefono VARCHAR(20) AS BEGIN UPDATE proveedores SET nombre=@nombre, email=@email, telefono=@telefono WHERE id=@id; END
GO
CREATE PROCEDURE [dbo].[sp_DeleteProveedor] @id INT AS BEGIN DELETE FROM proveedores WHERE id=@id; END
GO

-- ================================================================================
-- COMPRA
-- ================================================================================
IF OBJECT_ID('dbo.sp_RegisterPurchase', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_RegisterPurchase;
GO

CREATE PROCEDURE [dbo].[sp_RegisterPurchase]
    @proveedor_id INT,
    @total_compra MONEY,
    @id_usuario INT,
    @detalle_compra XML
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @items_a_comprar TABLE (
        inventario_id INT,
        cantidad INT,
        costo_unitario MONEY
    );

    INSERT INTO @items_a_comprar(inventario_id, cantidad, costo_unitario)
    SELECT
        T.item.value('@inventario_id', 'int'),
        T.item.value('@cantidad', 'int'),
        T.item.value('@costo_unitario', 'money')
    FROM @detalle_compra.nodes('/items/item') AS T(item);

    IF EXISTS (
        SELECT 1
        FROM @items_a_comprar c
        LEFT JOIN inventario i ON c.inventario_id = i.id
        WHERE i.id IS NULL
    )
    BEGIN
        THROW 51001, 'Uno o más IDs de inventario en el detalle de compra no existen. Asegúrese de añadir el stock con sp_AddInventory primero.', 1;
        RETURN;
    END

    BEGIN TRAN;

    BEGIN TRY
        DECLARE @compra_id INT;

        INSERT INTO registro_compras(proveedor_id, total_compra, id_usuario)
        VALUES(@proveedor_id, @total_compra, @id_usuario);
        SET @compra_id = SCOPE_IDENTITY();

        INSERT INTO detalle_compras(compra_id, inventario_id, cantidad, costo_unitario)
        SELECT @compra_id, inventario_id, cantidad, costo_unitario FROM @items_a_comprar;

        UPDATE i
        SET i.existencia = i.existencia + c.cantidad
        FROM inventario i
        JOIN @items_a_comprar c ON i.id = c.inventario_id;

        INSERT INTO movimientos_stock (inventario_id, fecha, tipo_movimiento, cantidad, id_usuario, referencia_id)
        SELECT
            inventario_id,
            GETDATE(),
            'entrada por compra',
            cantidad,
            @id_usuario,
            @compra_id
        FROM @items_a_comprar;

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;
        THROW;
    END CATCH
END
GO

-- ================================================================================
-- DEVOLUCIONES
-- ================================================================================
IF OBJECT_ID('dbo.sp_RegisterReturn', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_RegisterReturn;
GO

CREATE PROCEDURE [dbo].[sp_RegisterReturn]
    @venta_id INT,
    @cantidad_devuelta INT,
    @motivo TEXT,
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRAN;

    BEGIN TRY
        DECLARE @inventario_id INT;
        DECLARE @cantidad_vendida INT;
        DECLARE @total_devuelto INT;

        SELECT 
            @inventario_id = rv.inventario_id,
            @cantidad_vendida = rv.cantidad
        FROM registro_ventas rv
        WHERE rv.id = @venta_id;

        IF @inventario_id IS NULL
        BEGIN
            THROW 51000, 'La venta original no existe.', 1;
            RETURN;
        END

        SELECT @total_devuelto = ISNULL(SUM(cantidad_devuelta), 0)
        FROM devoluciones
        WHERE venta_id = @venta_id;

        IF (@total_devuelto + @cantidad_devuelta) > @cantidad_vendida
        BEGIN
            DECLARE @error_msg VARCHAR(200) = 'No se puede devolver más de lo comprado. Cantidad comprada: ' + CAST(@cantidad_vendida AS VARCHAR) + ', Total ya devuelto: ' + CAST(@total_devuelto AS VARCHAR) + '.';
            THROW 51000, @error_msg, 1;
            RETURN;
        END

        INSERT INTO devoluciones (venta_id, cantidad_devuelta, motivo, id_usuario)
        VALUES (@venta_id, @cantidad_devuelta, @motivo, @id_usuario);
        
        DECLARE @devolucion_id INT = SCOPE_IDENTITY();

        UPDATE inventario
        SET existencia = existencia + @cantidad_devuelta
        WHERE id = @inventario_id;

        INSERT INTO movimientos_stock (inventario_id, fecha, tipo_movimiento, cantidad, id_usuario, referencia_id)
        VALUES (@inventario_id, GETDATE(), 'entrada por devolución', @cantidad_devuelta, @id_usuario, @devolucion_id);

        COMMIT TRAN;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;
        THROW;
    END CATCH
END
GO

-- ================================================================================
-- REPORTES
-- ================================================================================
CREATE PROCEDURE [dbo].[sp_GetMostSoldProducts] @fecha_inicio DATE, @fecha_fin DATE AS BEGIN DECLARE @fecha_fin_ajustada DATETIME = DATEADD(day, 1, @fecha_fin); SELECT TOP 20 p.nombre, t.nombre as talla, c.nombre as color, SUM(rv.cantidad) as total_vendido FROM registro_ventas rv JOIN facturas f ON rv.factura_id = f.id JOIN inventario i ON rv.inventario_id = i.id JOIN productos p ON i.producto_id = p.id JOIN tallas t ON i.talla_id = t.id JOIN colores c ON i.color_id = c.id WHERE f.fecha_creacion >= @fecha_inicio AND f.fecha_creacion < @fecha_fin_ajustada GROUP BY p.nombre, t.nombre, c.nombre ORDER BY total_vendido DESC; END
GO
CREATE PROCEDURE [dbo].[sp_GetLowStock] @limite_existencia INT AS BEGIN SELECT p.nombre AS nombre_producto, t.nombre AS talla, c.nombre AS color, i.existencia FROM inventario i JOIN productos p ON i.producto_id = p.id JOIN tallas t ON i.talla_id = t.id JOIN colores c ON i.color_id = c.id WHERE i.existencia <= @limite_existencia ORDER BY i.existencia ASC; END
GO
CREATE PROCEDURE [dbo].[sp_GetStockMovements] AS 
BEGIN 
    SELECT 
        m.id, 
        m.fecha AS fecha_movimiento, 
        p.nombre AS nombre_producto, 
        t.nombre AS talla, 
        c.nombre AS color, 
        m.tipo_movimiento, 
        m.cantidad, 
        u.nombre AS nombre_usuario, 
        m.referencia_id 
    FROM movimientos_stock m 
    JOIN inventario i ON m.inventario_id = i.id 
    JOIN productos p ON i.producto_id = p.id 
    JOIN tallas t ON i.talla_id = t.id 
    JOIN colores c ON i.color_id = c.id 
    JOIN usuarios u ON m.id_usuario = u.id 
    ORDER BY m.fecha DESC; 
END
GO
CREATE PROCEDURE [dbo].[sp_GetGeneralSalesReport] @fecha_inicio DATE, @fecha_fin DATE AS BEGIN DECLARE @fecha_fin_ajustada DATETIME = DATEADD(day, 1, @fecha_fin); SELECT ISNULL(SUM(total_factura), 0) AS totalRevenue, COUNT(id) AS numberOfSales FROM facturas WHERE fecha_creacion >= @fecha_inicio AND fecha_creacion < @fecha_fin_ajustada; END
GO
CREATE PROCEDURE [dbo].[sp_GetSaleDateRange] AS BEGIN SELECT MIN(fecha_creacion) AS minDate, MAX(fecha_creacion) AS maxDate FROM facturas; END
GO

PRINT '=================================================='
PRINT '== Base de datos "SFD" CREADA con ÉXITO.      =='
PRINT '=================================================='
GO