import { useState, useEffect } from "react";
import { createProduct, getCategories, getProviders, getSizes, getColors, addProductImage, addInventory, deleteProductImage, getProductDetails } from "../api/apiService";
import Input from "./input";
import Button from "./button";

const NewProduct = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    const [productData, setProductData] = useState({ nombre: '', codigo_producto: '', descripcion: '', precio: '', categoria_id: '', proveedor_id: '' });
    const [imageUrl, setImageUrl] = useState('');
    const [images, setImages] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [invTallaId, setInvTallaId] = useState('');
    const [invColorId, setInvColorId] = useState('');
    const [invCantidad, setInvCantidad] = useState(1);

    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [createdId, setCreatedId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [catRes, provRes, sizesRes, colorsRes] = await Promise.all([
                    getCategories(), getProviders(), getSizes(), getColors()
                ]);
                setCategorias(catRes.data);
                setProveedores(provRes.data);
                setSizes(sizesRes.data);
                setColors(colorsRes.data);
            } catch (err) {
                setError("Error al cargar datos iniciales");
            }
        };
        loadData();
    }, []);

    const handleInputChange = (name, value) => {
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!productData.nombre || !productData.precio || !productData.categoria_id) {
            setError("Nombre, precio y categoría son obligatorios.");
            return;
        }

        try {
            const res = await createProduct({
                ...productData,
                codigo_producto: productData.codigo_producto?.toUpperCase() || null,
                precio: parseFloat(productData.precio),
                categoria_id: parseInt(productData.categoria_id),
                proveedor_id: productData.proveedor_id ? parseInt(productData.proveedor_id) : null
            });
            setCreatedId(res.data.newProductId);
            setMessage("Producto creado correctamente.");
        } catch (err) {
            if (err.response?.data?.includes('codigo_producto')) {
                setError("Este código de producto ya ha sido registrado.");
            } else {
                setError("Error al crear producto.");
            }
        }
    };

    const refreshImagesAndInventory = async () => {
        if (!createdId) return;
        const res = await getProductDetails(createdId);
        setImages(res.data.imagenes || []);
        setInventory(res.data.inventario || []);
    };

    const handleAddImage = async (e) => {
        e.preventDefault();
        if (!imageUrl || !createdId) return;
        try {
            await addProductImage(createdId, { url_imagen: imageUrl });
            await refreshImagesAndInventory();
            setImageUrl('');
        } catch (err) {
            setError("Error al subir imagen");
        }
    };

    const handleDeleteImage = async (imageId) => {
        try {
            await deleteProductImage(imageId);
            await refreshImagesAndInventory();
        } catch (err) {
            setError("Error al eliminar imagen");
        }
    };

const handleAddInventory = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!invTallaId || !invColorId || invCantidad <= 0 || !createdId) {
            setError("Talla, color y cantidad válidas son requeridas");
            return;
        }
        try {
            const res = await addInventory({
                producto_id: createdId,
                talla_id: parseInt(invTallaId),
                color_id: parseInt(invColorId),
                cantidad: parseInt(invCantidad),
                id_usuario: user.id
            });
            
            setMessage("Stock agregado correctamente.");
            
            // ACTUALIZACIÓN DIRECTA DEL ESTADO CON LOS DATOS DEL BACKEND
            if (res.data.inventario) {
                setInventory(res.data.inventario);
            } else {
                // Fallback por si acaso
                await refreshImagesAndInventory();
            }

            setInvTallaId('');
            setInvColorId('');
            setInvCantidad(1);
            
        } catch (err) {
            console.error(err);
            if (err.response?.status === 409 || err.response?.data?.includes("ya podría existir")) {
                setMessage("Stock actualizado correctamente.");
            } else {
                // Mostrar el mensaje real del error
                setError(err.response?.data?.msg || "Error al agregar inventario");
            }
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Producto</h2>
            {error && <p className="text-center mb-4 font-semibold text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
            {message && <p className="text-center mb-4 font-semibold text-blue-600 bg-blue-100 p-3 rounded-lg">{message}</p>}

            <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-lg shadow-lg border mb-8 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <Input title="Nombre del Producto" name="nombre" placeholder="Ej: Camisa Polo Clásica" value={productData.nombre} event={val => handleInputChange('nombre', val)} />
                    <Input title="Código (SKU)" name="codigo_producto" placeholder="Ej: CAM-POL-001" value={productData.codigo_producto} event={val => handleInputChange('codigo_producto', val)} />
                    <Input title="Precio" name="precio" type="number" placeholder="0.00" value={productData.precio} event={val => handleInputChange('precio', val)} />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                        <select name="categoria_id" value={productData.categoria_id} onChange={(e) => handleInputChange('categoria_id', e.target.value)} className="block w-full p-3 bg-white border border-gray-300 shadow-sm rounded-md">
                            <option value="">Selecciona una categoría</option>
                            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Proveedor</label>
                        <select name="proveedor_id" value={productData.proveedor_id} onChange={(e) => handleInputChange('proveedor_id', e.target.value)} className="block w-full p-3 bg-white border border-gray-300 shadow-sm rounded-md">
                            <option value="">Sin Proveedor</option>
                            {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                        <textarea name="descripcion" value={productData.descripcion} onChange={(e) => handleInputChange('descripcion', e.target.value)} rows="4" className="block w-full p-3 bg-white border border-gray-300 shadow-sm rounded-md"></textarea>
                    </div>
                </div>
                <Button title="Crear Producto" type="submit" className="w-full" />
            </form>

            {createdId && (
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Imágenes del Producto</h3>
                        <div className="flex flex-wrap gap-4 mb-4 p-2 bg-gray-50 rounded-md border">
                            {images.length > 0 ? images.map(img => (
                                <div key={img.id} className="relative">
                                    <img src={img.url_imagen} alt="imagen" className="w-24 h-24 object-cover rounded-md border" />
                                    <button onClick={() => handleDeleteImage(img.id)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                                </div>
                            )) : <p className="text-gray-500 w-full text-center">No hay imágenes.</p>}
                        </div>
                        <form onSubmit={handleAddImage} className="flex items-end gap-4">
                            <div className="flex-grow">
                                <Input title="URL de la Imagen" placeholder="https://ejemplo.com/imagen.jpg" value={imageUrl} event={setImageUrl} name="image_url" />
                            </div>
                            <Button title="Añadir" type="submit" />
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Inventario</h3>
                        <div className="max-h-48 overflow-y-auto mb-4 border rounded-md">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="p-2 text-left font-semibold">Talla</th>
                                        <th className="p-2 text-left font-semibold">Color</th>
                                        <th className="p-2 text-right font-semibold">Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {inventory.length > 0 ? inventory.map(item => (
                                        <tr key={item.inventario_id}>
                                            <td className="p-2">{item.talla}</td>
                                            <td className="p-2">{item.color}</td>
                                            <td className="p-2 text-right font-bold">{item.existencia}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" className="text-center p-4 text-gray-500">No hay inventario</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <form onSubmit={handleAddInventory} className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <select value={invTallaId} onChange={e => setInvTallaId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                    <option value="">Talla</option>
                                    {sizes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                                </select>
                                <select value={invColorId} onChange={e => setInvColorId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                    <option value="">Color</option>
                                    {colors.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <Input title="Cantidad" type="number" value={invCantidad} event={setInvCantidad} name="invCantidad" placeholder="1" />
                            <Button title="Añadir Stock" type="submit" className="w-full" />
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewProduct;