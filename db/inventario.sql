USE [master]
GO
/****** Object:  Database [Inventario]      ******/
CREATE DATABASE [Inventario]
GO
ALTER DATABASE [Inventario] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Inventario].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Inventario] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Inventario] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Inventario] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Inventario] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Inventario] SET ARITHABORT OFF 
GO
ALTER DATABASE [Inventario] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Inventario] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Inventario] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Inventario] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Inventario] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Inventario] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Inventario] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Inventario] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Inventario] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Inventario] SET  ENABLE_BROKER 
GO
ALTER DATABASE [Inventario] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Inventario] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Inventario] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Inventario] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Inventario] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Inventario] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Inventario] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Inventario] SET RECOVERY FULL 
GO
ALTER DATABASE [Inventario] SET  MULTI_USER 
GO
ALTER DATABASE [Inventario] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Inventario] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Inventario] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Inventario] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Inventario] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Inventario] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'Inventario', N'ON'
GO
ALTER DATABASE [Inventario] SET QUERY_STORE = ON
GO
ALTER DATABASE [Inventario] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Inventario]
GO
/****** Object:  Table [dbo].[productos]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[productos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo_producto] [varchar](255) NULL,
	[nombre] [varchar](255) NULL,
	[existencia] [int] NULL,
	[precio] [varchar](255) NULL,
	[img] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[registro_ventas]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[registro_ventas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[fecha_venta] [date] NULL,
	[producto_id] [int] NULL,
	[cantidad] [int] NULL,
	[precio_unitario] [money] NULL,
	[total] [money] NULL,
	[id_usuario] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usuarios]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](255) NULL,
	[apellido] [varchar](255) NULL,
	[clave] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET IDENTITY_INSERT [dbo].[usuarios] ON 

INSERT [dbo].[usuarios] ([id], [nombre], [apellido], [clave]) VALUES (1, N'Gustavo', N'Moros', N'Gam1060!')
INSERT [dbo].[usuarios] ([id], [nombre], [apellido], [clave]) VALUES (2, N'Angelica', N'Cobo', N'Oliver.2010!')
SET IDENTITY_INSERT [dbo].[usuarios] OFF
GO

ALTER TABLE [dbo].[registro_ventas]  WITH CHECK ADD FOREIGN KEY([producto_id])
REFERENCES [dbo].[productos] ([id])
GO
ALTER TABLE [dbo].[registro_ventas]  WITH CHECK ADD  CONSTRAINT [fk_id_usuario] FOREIGN KEY([id_usuario])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[registro_ventas] CHECK CONSTRAINT [fk_id_usuario]
GO
/****** Object:  StoredProcedure [dbo].[GetAllRecords]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAllRecords]
AS
BEGIN 
	select usuarios.nombre as nombre_usuario, registro_ventas.fecha_venta, productos.nombre as nombre_producto, registro_ventas.cantidad,registro_ventas.precio_unitario, registro_ventas.total
	from registro_ventas, usuarios, productos
	where productos.id=registro_ventas.producto_id and usuarios.id=registro_ventas.id_usuario;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetAllUsers]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAllUsers]
AS
BEGIN
	SELECT * FROM usuarios;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetUser]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetUser]
	@id int
AS
BEGIN
	SELECT * FROM usuarios
	WHERE id=@id;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetUserName]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetUserName]
	@name varchar(255)
AS
BEGIN
	SELECT * FROM USUARIOS
	WHERE NOMBRE=@name;
END;
GO
/****** Object:  StoredProcedure [dbo].[InsertRegistro]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[InsertRegistro]
    @fecha_venta DATE,
    @producto_id INT,
    @cantidad INT,
    @precio_unitario money,
	@usuario_id INT
AS
BEGIN
    INSERT INTO registro_ventas VALUES (@fecha_venta, @producto_id, @cantidad, @precio_unitario, @cantidad * @precio_unitario, @usuario_id);
	exec SP_RestarExistencias @producto_id,@cantidad;
END;
GO
/****** Object:  StoredProcedure [dbo].[InsertUser]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[InsertUser]
    @nombre VARCHAR(255),
    @apellido VARCHAR(255),
    @clave VARCHAR(255)
AS
BEGIN
    INSERT INTO usuarios (nombre,apellido,clave)
    VALUES (@nombre, @apellido, @clave);
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_BorrarProductosPorCodigo]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_BorrarProductosPorCodigo]
    @codigo_producto VARCHAR(255)
AS
BEGIN
    -- Eliminar productos que tengan un código similar
    DELETE FROM Productos
    WHERE codigo_producto LIKE '%' + @codigo_producto + '%';
END
GO
/****** Object:  StoredProcedure [dbo].[SP_Consulta]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_Consulta]
AS
SELECT * FROM productos
WHERE codigo_producto = 'A005'
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteProduct]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_DeleteProduct]
	@code varchar(225)
AS
BEGIN
	delete productos
	where codigo_producto=@code
END
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteProductById]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_DeleteProductById]
	@id int
AS
BEGIN
	delete productos
	where id=@id
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAllProducts]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetAllProducts]
AS
BEGIN
    SELECT * FROM productos;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetProduct]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetProduct]
	@code varchar(225)
AS
BEGIN
	select * from productos
	where codigo_producto=@code
END
GO
/****** Object:  StoredProcedure [dbo].[sp_InsertProduct]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_InsertProduct]
	@code varchar(225),
	@name  varchar(225),
	@exist int,
	@price varchar(255),
	@img varchar(255)
AS
BEGIN
    INSERT INTO Productos (codigo_producto, nombre, existencia, precio, img)
	values (@code, @name,@exist,@price,@img);
END
GO
/****** Object:  StoredProcedure [dbo].[SP_Prueba1]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[SP_Prueba1]
as
print 'Hola mundo'
execute SP_Prueba1
GO
/****** Object:  StoredProcedure [dbo].[SP_RestarExistencias]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_RestarExistencias]
@id INT,
@Cantidad AS INT
AS
UPDATE productos SET existencia-=@Cantidad
WHERE id=@id;
GO
/****** Object:  StoredProcedure [dbo].[SP_SumarExistencias]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_SumarExistencias]
@CodProducto AS VARCHAR(225),
@Cantidad AS INT
AS
UPDATE productos SET existencia+=@Cantidad
WHERE codigo_producto=@CodProducto
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateProduct]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_UpdateProduct]
	@code varchar(225),
	@name  varchar(225),
	@exist int,
	@price varchar(255),
	@img varchar(255)
AS
BEGIN
	Update productos
	set nombre=@name, existencia=@exist , precio=@price, img=@img
	where productos.codigo_producto=@code;
END
GO
USE [master]
GO
ALTER DATABASE [Inventario] SET  READ_WRITE 
GO