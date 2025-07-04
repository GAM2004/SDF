import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails, updateProduct, getCategories, getProviders, getSizes, getColors, addInventory,addProductImage, deleteProductImage } from "../api/apiService";
import Button from "./button";

const InputEdit = ({ title, type = 'text', placeholder, value, event, name }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{title}</label>
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={event}
            className="block w-full p-3 bg-white border border-gray-300 shadow-sm rounded-md outline-indigo-500/95"
        />
    </div>
);

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user'));

    const [productData, setProductData] = useState({
        nombre: '', codigo_producto: '', descripcion: '', precio: '', categoria_id: '', proveedor_id: ''
    });
    const [inventory, setInventory] = useState([]);
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [allCategories, setAllCategories] = useState([]);
    const [allProviders, setAllProviders] = useState([]);
    const [allSizes, setAllSizes] = useState([]);
    const [allColors, setAllColors] = useState([]);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [stockTallaId, setStockTallaId] = useState('');
    const [stockColorId, setStockColorId] = useState('');
    const [stockCantidad, setStockCantidad] = useState(1);

    const fetchData = async () => {
        try {
            const [catRes, provRes, sizesRes, colorsRes, productRes] = await Promise.all([
                getCategories(), getProviders(), getSizes(), getColors(), getProductDetails(id)
            ]);
            setAllCategories(catRes.data);
            setAllProviders(provRes.data);
            setAllSizes(sizesRes.data);
            setAllColors(colorsRes.data);
            const { imagenes, inventario, ...baseProductData } = productRes.data;
            setProductData(baseProductData);
            setImages(imagenes || []);
            setInventory(inventario || []);
        } catch (err) {
            setError("Error al cargar los datos del producto.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateBaseProduct = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        if (!productData.nombre || !productData.precio || !productData.categoria_id) {
            setError("Nombre, precio y categoría son obligatorios.");
            return;
        }
        try {
            await updateProduct(id, productData);
            setMessage("Datos generales actualizados con éxito.");
        } catch (err) {
            setError("Error al actualizar los datos del producto.");
        }
    };

    const handleAddImage = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        if (!newImageUrl) {
            setError("La URL de la imagen no puede estar vacía.");
            return;
        }
        try {
            await addProductImage(id, { url_imagen: newImageUrl });
            setMessage("Imagen añadida con éxito.");
            setNewImageUrl('');
            await fetchData();
        } catch (err) {
            setError("Error al añadir la imagen.");
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (window.confirm("¿Seguro que deseas eliminar esta imagen?")) {
            try {
                await deleteProductImage(imageId);
                setMessage("Imagen eliminada con éxito.");
                await fetchData();
            } catch (err) {
                setError("Error al eliminar la imagen.");
            }
        }
    };

    const handleAddStock = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        if (!stockTallaId || !stockColorId || stockCantidad <= 0) {
            setError("Debe seleccionar talla, color y una cantidad válida.");
            return;
        }
        const stockData = {
            producto_id: id,
            talla_id: parseInt(stockTallaId),
            color_id: parseInt(stockColorId),
            cantidad: parseInt(stockCantidad),
            id_usuario: user.id
        };
        try {
            await addInventory(stockData);
            setMessage("Stock actualizado con éxito.");
            setStockTallaId(''); setStockColorId(''); setStockCantidad(1);
            await fetchData();
        } catch (err) {
            setError("Error al agregar stock. La combinación de talla y color ya podría existir.");
        }
    };

    if (loading) return <p className="text-center mt-8 font-semibold">Cargando editor de producto...</p>;

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Editar Producto: {productData.nombre}</h2>

            {error && <p className="text-center mb-4 font-semibold text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
            {message && <p className="text-center mb-4 font-semibold text-blue-600 bg-blue-100 p-3 rounded-lg">{message}</p>}

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg border">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Datos Generales</h3>
                    <form onSubmit={handleUpdateBaseProduct} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <InputEdit title="Nombre del Producto" name="nombre" value={productData.nombre} event={handleInputChange} />
                            <InputEdit title="Código (SKU)" name="codigo_producto" value={productData.codigo_producto || ''} event={handleInputChange} />
                            <InputEdit title="Precio" type="number" name="precio" value={productData.precio} event={handleInputChange} />
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Categoría</label>
                                <select name="categoria_id" value={productData.categoria_id} onChange={handleInputChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white">
                                    {allCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700">Proveedor</label>
                                <select name="proveedor_id" value={productData.proveedor_id || ''} onChange={handleInputChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white">
                                    <option value="">Ninguno</option>
                                    {allProviders.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700">Descripción</label>
                                <textarea name="descripcion" value={productData.descripcion || ''} onChange={handleInputChange} rows="4" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                        </div>
                        <Button title="Guardar Datos Generales" type="submit" />
                    </form>
                </div>

                <div className="space-y-8">
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
                        <form onSubmit={handleAddStock} className="space-y-3">
                            <p className="font-semibold text-gray-700">Añadir o Actualizar Stock</p>
                            <div className="grid grid-cols-2 gap-2">
                                <select value={stockTallaId} onChange={e => setStockTallaId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                    <option value="">Talla</option>
                                    {allSizes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                                </select>
                                <select value={stockColorId} onChange={e => setStockColorId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                    <option value="">Color</option>
                                    {allColors.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <InputEdit title="Cantidad a Añadir" type="number" value={stockCantidad} event={(e) => setStockCantidad(e.target.value)} name="stock_cantidad" />
                            <Button title="Añadir Stock" type="submit" className="w-full" />
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Imágenes</h3>
                        <div className="flex flex-wrap gap-4 mb-4 p-2 bg-gray-50 rounded-md border">
                            {images.length > 0 ? images.map(img => (
                                <div key={img.id} className="relative">
                                    <img src={img.url_imagen} alt="thumbnail" className="w-24 h-24 object-cover rounded-md border-2 border-gray-200" />
                                    <button
                                        onClick={() => handleDeleteImage(img.id)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold hover:bg-red-700"
                                        title="Eliminar imagen"
                                    >
                                        ×
                                    </button>
                                </div>
                            )) : (
                                <p className="text-gray-500 w-full text-center">No hay imágenes.</p>
                            )}
                        </div>
                        <form onSubmit={handleAddImage} className="flex items-end gap-4">
                            <div className="flex-grow">
                                <InputEdit title="URL de nueva imagen" value={newImageUrl} event={(e) => setNewImageUrl(e.target.value)} name="new_image_url" />
                            </div>
                            <Button title="Añadir" type="submit" />
                        </form>
                    </div>
                </div>
            </div>

            <div className="text-center mt-8">
                <Button title="Volver al Catálogo" event={() => navigate('/dashboard/products')} className="bg-gray-600 hover:bg-gray-800" />
            </div>
        </div>
    );
};

export default EditProduct;
