import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductDetails, getSizes, getColors, addInventory, deleteProduct } from "../api/apiService";
import { useCart } from '../context/CartContext';
import Button from "./button";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartCount, cartItems } = useCart();
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [details, setDetails] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [stockTallaId, setStockTallaId] = useState('');
    const [stockColorId, setStockColorId] = useState('');
    const [stockCantidad, setStockCantidad] = useState(1);

    const fetchDetails = async () => {
        try {
            const response = await getProductDetails(id);
            setDetails(response.data);
            if (response.data.imagenes?.length > 0) {
                setMainImage(response.data.imagenes[0].url_imagen);
            } else {
                setMainImage(null);
            }
        } catch (err) { setError("Error al cargar detalles."); }
    };

    useEffect(() => {
        fetchDetails();
        const loadAttributes = async () => {
            try {
                const [sizesRes, colorsRes] = await Promise.all([getSizes(), getColors()]);
                setSizes(sizesRes.data);
                setColors(colorsRes.data);
            } catch (err) { console.error("Error cargando atributos", err); }
        };
        loadAttributes();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedVariant) { setError("Selecciona una talla y color."); return; }
        if (quantity > selectedVariant.existencia) { setError("La cantidad excede el stock."); return; }
        setError('');
        setMessage(`'${details.nombre}' añadido al carrito!`);
        addToCart(details, selectedVariant, quantity);
        setTimeout(() => setMessage(''), 2000);
    };

    const handleAddStock = async (e) => {
        e.preventDefault();
        setError(''); setMessage('');
        if (!stockTallaId || !stockColorId || stockCantidad <= 0) { setError("Selecciona talla, color y cantidad válida."); return; }
        const stockData = {
            producto_id: id,
            talla_id: parseInt(stockTallaId),
            color_id: parseInt(stockColorId),
            cantidad: parseInt(stockCantidad),
            id_usuario: user.id
        };
        try {
            await addInventory(stockData);
            setMessage(`Stock actualizado.`);
            await fetchDetails(); // Recargar todos los detalles
            setStockTallaId('');
            setStockColorId('');
            setStockCantidad(1);
        } catch (err) { setError("Error al actualizar stock."); }
    };

    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.")) {
            try {
                await deleteProduct(id);
                setMessage("Producto eliminado con éxito.");
                setTimeout(() => navigate('/dashboard/products'), 1500);
            } catch (err) {
                setError("Error al eliminar el producto.");
            }
        }
    };

    if (!details) return <p className="text-center mt-8 font-semibold">Cargando...</p>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate('/dashboard/products')}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors text-sm"
                >
                    &lt; Volver al Catálogo
                </button>

                <div className="flex gap-2">
                    <Link
                        to={`/dashboard/products/edit/${id}`}
                        className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors text-sm"
                    >
                        ✏️ Editar
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors text-sm"
                    >
                        🗑️ Eliminar
                    </button>
                </div>
            </div>

            {error && <p className="text-center mb-4 font-semibold text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
            {message && <p className="text-center mb-4 font-semibold text-blue-600 bg-blue-100 p-3 rounded-lg">{message}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="mb-4">
                        <img src={mainImage || 'https://placehold.co/600x400?text=Sin+Imagen'} alt={details.nombre} className="w-full h-96 object-contain rounded-lg shadow-lg border bg-white" />
                        <div className="flex gap-2 mt-2">
                            {details.imagenes.map(img => (
                                <img
                                    key={img.id}
                                    src={img.url_imagen}
                                    alt="thumbnail"
                                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img.url_imagen ? 'border-violet-500' : 'border-transparent'}`}
                                    onClick={() => setMainImage(img.url_imagen)}
                                />
                            ))}
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold">{details.nombre}</h2>
                    <p className="text-lg text-gray-500 mb-2">Código: {details.codigo_producto || 'N/A'}</p>
                    <p className="text-2xl font-light text-blue-600">${details.precio}</p>
                    <p className="text-md text-gray-700 mb-4">{details.descripcion}</p>
                </div>

                <div>
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        <h3 className="text-xl font-semibold mb-4">Selecciona para Vender</h3>
                        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                            {details.inventario.length > 0 ? (
                                details.inventario.map(variant => (
                                    <div
                                        key={variant.inventario_id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border-2 ${selectedVariant?.inventario_id === variant.inventario_id ? 'border-violet-500 bg-violet-100' : 'border-transparent bg-white'}`}
                                    >
                                        <span>Talla: {variant.talla}, Color: {variant.color}</span>
                                        <span className={`font-bold text-sm ${variant.existencia > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            Stock: {variant.existencia}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No hay inventario disponible.</p>
                            )}
                        </div>
                        {selectedVariant && (
                            <div className="flex items-center gap-4 border-t pt-4">
                                <label className="font-semibold">Cantidad:</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    min="1"
                                    max={selectedVariant.existencia}
                                    className="w-20 p-2 border rounded-md text-center"
                                />
                                <Button title="Agregar al Carrito" event={handleAddToCart} disabled={!selectedVariant || selectedVariant.existencia === 0} />
                            </div>
                        )}
                    </div>

                    {cartCount > 0 && (
                        <div className="bg-blue-50 mt-6 p-4 rounded-lg shadow-md">
                            <h4 className="font-bold text-lg mb-2">Resumen del Carrito</h4>
                            <div className="max-h-32 overflow-y-auto space-y-1 mb-2">
                                {cartItems.map(item => (
                                    <div key={item.inventario_id} className="text-sm flex justify-between">
                                        <span>{item.quantity} x {item.nombre} ({item.talla})</span>
                                        <span>${(item.quantity * item.precio).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="font-bold flex justify-between border-t pt-2">
                                <span>Total:</span>
                                <span>${cartItems.reduce((acc, item) => acc + item.quantity * item.precio, 0).toFixed(2)}</span>
                            </div>
                            <Button title="Ver Carrito y Pagar" className="w-full mt-4" event={() => navigate('/dashboard/cart')} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
