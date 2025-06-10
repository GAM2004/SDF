
USE [master]
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'Inventario')
BEGIN
    CREATE DATABASE [Inventario]
END
GO

ALTER DATABASE [Inventario] SET COMPATIBILITY_LEVEL = 160;
ALTER DATABASE [Inventario] SET RECOVERY FULL;
GO

USE [Inventario]
GO

IF OBJECT_ID('dbo.GetAllRecords', 'P') IS NOT NULL DROP PROCEDURE dbo.GetAllRecords;
IF OBJECT_ID('dbo.InsertRegistro', 'P') IS NOT NULL DROP PROCEDURE dbo.InsertRegistro;
IF OBJECT_ID('dbo.sp_DeleteProductById', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_DeleteProductById;
IF OBJECT_ID('dbo.sp_DeleteProduct', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_DeleteProduct;
IF OBJECT_ID('dbo.sp_DeleteProveedor', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_DeleteProveedor;
IF OBJECT_ID('dbo.SP_SumarExistencias', 'P') IS NOT NULL DROP PROCEDURE dbo.SP_SumarExistencias;
IF OBJECT_ID('dbo.SP_RestarExistencias', 'P') IS NOT NULL DROP PROCEDURE dbo.SP_RestarExistencias;
IF OBJECT_ID('dbo.sp_GetAllProducts', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetAllProducts;
IF OBJECT_ID('dbo.sp_GetProduct', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetProduct;
IF OBJECT_ID('dbo.sp_InsertProduct', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_InsertProduct;
IF OBJECT_ID('dbo.sp_UpdateProduct', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_UpdateProduct;
IF OBJECT_ID('dbo.sp_GetAllProveedores', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetAllProveedores;
IF OBJECT_ID('dbo.sp_GetProveedorById', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetProveedorById;
IF OBJECT_ID('dbo.sp_InsertProveedor', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_InsertProveedor;
IF OBJECT_ID('dbo.sp_UpdateProveedor', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_UpdateProveedor;
IF OBJECT_ID('dbo.GetAllUsers', 'P') IS NOT NULL DROP PROCEDURE dbo.GetAllUsers;
IF OBJECT_ID('dbo.InsertUser', 'P') IS NOT NULL DROP PROCEDURE dbo.InsertUser;
IF OBJECT_ID('dbo.GetUserName', 'P') IS NOT NULL DROP PROCEDURE dbo.GetUserName;
IF OBJECT_ID('dbo.sp_LoginUser', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_LoginUser;
GO
IF OBJECT_ID('dbo.registro_ventas', 'U') IS NOT NULL DROP TABLE dbo.registro_ventas;
IF OBJECT_ID('dbo.productos_historial', 'U') IS NOT NULL DROP TABLE dbo.productos_historial;
IF OBJECT_ID('dbo.productos', 'U') IS NOT NULL DROP TABLE dbo.productos;
IF OBJECT_ID('dbo.proveedores', 'U') IS NOT NULL DROP TABLE dbo.proveedores;
IF OBJECT_ID('dbo.usuarios', 'U') IS NOT NULL DROP TABLE dbo.usuarios;
GO

CREATE TABLE [dbo].[usuarios](
    [id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [nombre] [varchar](255) NULL,
    [apellido] [varchar](255) NULL,
    [clave] [varchar](255) NULL
);
GO

CREATE TABLE [dbo].[proveedores] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL
);
GO

CREATE TABLE [dbo].[productos](
    [id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [codigo_producto] [varchar](255) NULL UNIQUE,
    [nombre] [varchar](255) NULL,
    [existencia] [int] NULL,
    [precio] [varchar](255) NULL,
    [img] [varchar](255) NULL,
    [proveedor_id] [int] NULL
);
GO

CREATE TABLE [dbo].[productos_historial](
    [historial_id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [id_producto_original] [int] NOT NULL,
    [codigo_producto] [varchar](255) NULL,
    [nombre] [varchar](255) NULL,
    [precio] [varchar](255) NULL,
    [proveedor_id] [int] NULL,
    [fecha_eliminacion] [datetime] NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE [dbo].[registro_ventas](
    [id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [fecha_venta] [date] NULL,
    [producto_id] [int] NULL,
    [cantidad] [int] NULL,
    [precio_unitario] [money] NULL,
    [total] [money] NULL,
    [id_usuario] [int] NULL
);
GO

SET IDENTITY_INSERT [dbo].[usuarios] ON;
INSERT [dbo].[usuarios] ([id], [nombre], [apellido], [clave]) VALUES 
(1, N'Gustavo', N'Moros', N'Gam1606!'), 
(2, N'Angelica', N'Cobo', N'Oliver.2010!');
SET IDENTITY_INSERT [dbo].[usuarios] OFF;
GO

ALTER TABLE [dbo].[productos] WITH CHECK ADD CONSTRAINT [FK_productos_proveedores]
FOREIGN KEY([proveedor_id]) REFERENCES [dbo].[proveedores] ([id])
ON DELETE SET NULL;
GO

ALTER TABLE [dbo].[registro_ventas] WITH CHECK ADD CONSTRAINT [FK_registro_usuarios]
FOREIGN KEY([id_usuario]) REFERENCES [dbo].[usuarios] ([id]);
GO

CREATE PROCEDURE [dbo].[InsertUser] @nombre VARCHAR(255), @apellido VARCHAR(255), @clave VARCHAR(255) AS
BEGIN SET NOCOUNT ON; INSERT INTO usuarios (nombre, apellido, clave) VALUES (@nombre, @apellido, @clave); END;
GO
CREATE PROCEDURE [dbo].[GetAllUsers] AS
BEGIN SET NOCOUNT ON; SELECT id, nombre, apellido, clave FROM usuarios ORDER BY nombre; END;
GO
CREATE PROCEDURE [dbo].[sp_LoginUser] @nombre VARCHAR(255), @clave VARCHAR(255) AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, nombre, apellido
    FROM usuarios
    WHERE nombre = @nombre COLLATE SQL_Latin1_General_CP1_CS_AS
      AND clave = @clave COLLATE SQL_Latin1_General_CP1_CS_AS;
END
GO
CREATE PROCEDURE [dbo].[GetUserName] @name varchar(255) AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM usuarios WHERE nombre = @name;
END
GO

CREATE PROCEDURE dbo.sp_InsertProveedor @nombre VARCHAR(255), @email VARCHAR(255), @telefono VARCHAR(20) AS
BEGIN SET NOCOUNT ON; INSERT INTO dbo.proveedores (nombre, email, telefono) VALUES (@nombre, @email, @telefono); END
GO
CREATE PROCEDURE dbo.sp_GetAllProveedores AS
BEGIN SET NOCOUNT ON; SELECT * FROM dbo.proveedores ORDER BY nombre; END
GO
CREATE PROCEDURE dbo.sp_UpdateProveedor @id INT, @nombre VARCHAR(255), @email VARCHAR(255), @telefono VARCHAR(20) AS
BEGIN SET NOCOUNT ON; UPDATE dbo.proveedores SET nombre = @nombre, email = @email, telefono = @telefono WHERE id = @id; END
GO
CREATE PROCEDURE [dbo].[sp_DeleteProveedor] @id INT AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.proveedores WHERE id = @id;
END
GO

CREATE PROCEDURE [dbo].[sp_InsertProduct] @code varchar(225), @name varchar(225), @exist int, @price varchar(255), @img varchar(255), @proveedor_id int = NULL AS
BEGIN SET NOCOUNT ON; INSERT INTO Productos (codigo_producto, nombre, existencia, precio, img, proveedor_id) VALUES (@code, @name, @exist, @price, @img, @proveedor_id); END
GO
CREATE PROCEDURE [dbo].[sp_UpdateProduct] @code varchar(225), @name varchar(225), @exist int, @price varchar(255), @img varchar(255), @proveedor_id int = NULL AS
BEGIN SET NOCOUNT ON; UPDATE productos SET nombre=@name, existencia=@exist, precio=@price, img=@img, proveedor_id=@proveedor_id WHERE productos.codigo_producto=@code; END
GO
CREATE PROCEDURE [dbo].[sp_GetAllProducts] AS
BEGIN SET NOCOUNT ON; SELECT p.*, pr.nombre as nombre_proveedor FROM productos p LEFT JOIN proveedores pr ON p.proveedor_id = pr.id ORDER BY p.nombre; END
GO
CREATE PROCEDURE [dbo].[sp_GetProduct] @code varchar(225) AS
BEGIN SET NOCOUNT ON; SELECT p.*, pr.nombre as nombre_proveedor FROM productos p LEFT JOIN proveedores pr ON p.proveedor_id = pr.id WHERE p.codigo_producto=@code; END
GO

CREATE PROCEDURE [dbo].[sp_DeleteProductById] @id int AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRAN;
    BEGIN TRY
        INSERT INTO dbo.productos_historial (id_producto_original, codigo_producto, nombre, precio, proveedor_id, fecha_eliminacion)
        SELECT id, codigo_producto, nombre, precio, proveedor_id, GETDATE() FROM dbo.productos WHERE id = @id;
        DELETE FROM productos WHERE id = @id;
        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        ROLLBACK TRAN;
        THROW;
    END CATCH
END
GO
CREATE PROCEDURE [dbo].[sp_DeleteProduct] @code varchar(225) AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @id_a_borrar INT = (SELECT id FROM productos WHERE codigo_producto = @code);
    IF @id_a_borrar IS NOT NULL
    BEGIN
        EXEC sp_DeleteProductById @id = @id_a_borrar;
    END
END
GO

CREATE PROCEDURE [dbo].[SP_RestarExistencias] @id INT, @Cantidad INT AS
BEGIN SET NOCOUNT ON; UPDATE productos SET existencia -= @Cantidad WHERE id=@id; END;
GO
CREATE PROCEDURE [dbo].[SP_SumarExistencias] @CodProducto VARCHAR(225), @Cantidad INT AS
BEGIN SET NOCOUNT ON; UPDATE productos SET existencia += @Cantidad WHERE codigo_producto=@CodProducto; END
GO
CREATE PROCEDURE [dbo].InsertRegistro @fecha_venta DATE, @producto_id INT, @cantidad INT, @precio_unitario money, @usuario_id INT AS
BEGIN
    SET NOCOUNT ON;
    IF @cantidad > 0
    BEGIN
        IF (SELECT existencia FROM productos WHERE id = @producto_id) >= @cantidad
        BEGIN
            INSERT INTO registro_ventas (fecha_venta, producto_id, cantidad, precio_unitario, total, id_usuario)
            VALUES (@fecha_venta, @producto_id, @cantidad, @precio_unitario, @cantidad * @precio_unitario, @usuario_id);

            EXEC SP_RestarExistencias @id = @producto_id, @Cantidad = @cantidad;
        END
        ELSE
        BEGIN
            RAISERROR('Existencia insuficiente para realizar la venta.', 16, 1);
        END
    END
    ELSE IF @cantidad < 0
    BEGIN
        DECLARE @CantidadPositiva INT = @cantidad * -1;
        DECLARE @CodProducto VARCHAR(225);

        SELECT @CodProducto = codigo_producto FROM productos WHERE id = @producto_id;
        EXEC SP_SumarExistencias @CodProducto = @CodProducto, @Cantidad = @CantidadPositiva;
        INSERT INTO registro_ventas (fecha_venta, producto_id, cantidad, precio_unitario, total, id_usuario)
        VALUES (@fecha_venta, @producto_id, @cantidad, @precio_unitario, @cantidad * @precio_unitario, @usuario_id);
    END
END;
GO

CREATE PROCEDURE [dbo].[GetAllRecords] AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        rv.id,
        rv.fecha_venta,
        COALESCE(u.nombre, 'Vendedor Desconocido') AS nombre_usuario,
        COALESCE(p.nombre, ph.nombre, 'PRODUCTO ELIMINADO') AS nombre_producto,
        rv.cantidad,
        rv.precio_unitario,
        rv.total
    FROM registro_ventas rv
    LEFT JOIN usuarios u ON rv.id_usuario = u.id
    LEFT JOIN productos p ON rv.producto_id = p.id
    LEFT JOIN (
        SELECT id_producto_original, nombre, ROW_NUMBER() OVER(PARTITION BY id_producto_original ORDER BY fecha_eliminacion DESC) as rn
        FROM productos_historial
    ) ph ON rv.producto_id = ph.id_producto_original AND ph.rn = 1
    ORDER BY rv.id DESC;
END;
GO


PRINT '=================================================================='
PRINT '== Base de datos "Inventario" creada/actualizada correctamente. =='
PRINT '=================================================================='
GO

