import { useState, useEffect } from 'react';
import { getProviders, createProvider, deleteProvider, getProducts, getProductDetails, registerPurchase, getSizes, getColors, addInventory } from '../api/apiService';
import Button from './button';
import Input from './input';

const ProviderManager = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [products, setProducts] = useState([]);
    const [variants, setVariants] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [cost, setCost] = useState(0);
    const [purchaseItems, setPurchaseItems] = useState([]);
    
    const [providers, setProviders] = useState([]);
    const [newProvider, setNewProvider] = useState({ nombre: "", email: "", telefono: "" });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadInitialData = async () => {
        try {
            const [provResponse, prodResponse, sizesResponse, colorsResponse] = await Promise.all([
                getProviders(), getProducts(), getSizes(), getColors()
            ]);
            setProviders(provResponse.data);
            setProducts(prodResponse.data);
            setSizes(sizesResponse.data);
            setColors(colorsResponse.data);
        } catch (err) {
            setError("Error al cargar datos iniciales.");
            console.error("Failed to load initial data", err);
        }
    };
    
    useEffect(() => { loadInitialData() }, []);

    useEffect(() => {
        const loadVariants = async () => {
            if (!selectedProduct) { setVariants([]); return; }
            try {
                const details = await getProductDetails(selectedProduct);
                setVariants(details.data.inventario);
            } catch (err) {
                setError("Error al cargar variantes del producto.");
                console.error("Failed to load product variants", err);
            }
        };
        loadVariants();
    }, [selectedProduct]);

    const handleAddItem = async () => {
        setMessage('');
        setError('');
        if (!selectedProduct || !selectedSize || !selectedColor || quantity <= 0) {
            setError("Por favor, complete todos los campos del artículo.");
            return;
        }

        let variant = variants.find(v => v.talla_id == selectedSize && v.color_id == selectedColor);
        let variantId = variant?.inventario_id;

        if (!variant) {
            try {
                await addInventory({
                    producto_id: parseInt(selectedProduct),
                    talla_id: parseInt(selectedSize),
                    color_id: parseInt(selectedColor),
                    cantidad: 0,
                    id_usuario: user.id
                });
                const details = await getProductDetails(selectedProduct);
                setVariants(details.data.inventario);
                variantId = details.data.inventario.find(v => v.talla_id == selectedSize && v.color_id == selectedColor).inventario_id;
            } catch (err) {
                setError("Error al crear la nueva variante de producto.");
                console.error(err);
                return;
            }
        }

        const productDetails = products.find(p => p.id === parseInt(selectedProduct));
        const newItem = {
            inventario_id: variantId,
            productName: productDetails.nombre,
            variantName: `Talla: ${sizes.find(s=>s.id == selectedSize)?.nombre}, Color: ${colors.find(c=>c.id == selectedColor)?.nombre}`,
            quantity: parseInt(quantity),
            cost: parseFloat(cost),
            subtotal: parseInt(quantity) * parseFloat(cost)
        };
        
        if(purchaseItems.some(item => item.inventario_id === newItem.inventario_id)){
            setError("Este artículo ya está en la lista de compra.");
            return;
        }

        setPurchaseItems([...purchaseItems, newItem]);
        setSelectedSize('');
        setSelectedColor('');
        setQuantity(1);
        setCost(0);
    };

    const handleRegisterPurchase = async () => {
        setMessage('');
        setError('');
        if (!selectedProvider || purchaseItems.length === 0) {
            setError("Debe seleccionar un proveedor y agregar al menos un artículo.");
            return;
        }
        const total_compra = purchaseItems.reduce((acc, item) => acc + item.subtotal, 0);
        const purchaseData = {
            proveedor_id: parseInt(selectedProvider),
            total_compra,
            id_usuario: user.id,
            detalle: purchaseItems.map(item => ({
                inventario_id: item.inventario_id,
                cantidad: item.quantity,
                costo_unitario: item.cost
            }))
        };
        try {
            await registerPurchase(purchaseData);
            setMessage("¡Compra registrada con éxito! El stock ha sido actualizado.");
            setPurchaseItems([]);
            setSelectedProvider('');
        } catch (err) {
            setError("Error al registrar la compra.");
            console.error(err);
        }
    };
    
    const total = purchaseItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2);

    const handleCreateProvider = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        if (!newProvider.nombre) {
            setError("El nombre del proveedor es obligatorio.");
            return;
        }
        try {
            await createProvider(newProvider);
            setNewProvider({ nombre: "", email: "", telefono: "" });
            setMessage("Proveedor creado con éxito.");
            loadInitialData();
        } catch (err) {
            setError("Error al crear el proveedor.");
            console.error("Error creating provider:", err);
        }
    };

    const handleDeleteProvider = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este proveedor?")) {
            try {
                await deleteProvider(id);
                setMessage("Proveedor eliminado.");
                loadInitialData();
            } catch (err) {
                setError("Error al eliminar el proveedor.");
                console.error("Error deleting provider:", err);
            }
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h2 className="text-3xl font-bold text-center">Compras y Proveedores</h2>
            {error && <p className="text-center mb-4 font-semibold text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
            {message && <p className="text-center mb-4 font-semibold text-blue-600 bg-blue-100 p-3 rounded-lg">{message}</p>}

            
            {/* MÓDULO DE GESTIÓN DE PROVEEDORES */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* FORMULARIO PARA CREAR */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h3 className="text-xl font-semibold mb-4">Añadir Nuevo Proveedor</h3>
                    <form onSubmit={handleCreateProvider} className="space-y-4">
                        <Input title="Nombre" placeholder="Nombre del proveedor" value={newProvider.nombre} event={(val) => setNewProvider({ ...newProvider, nombre: val })} />
                        <Input title="Email" type="email" placeholder="correo@proveedor.com" value={newProvider.email} event={(val) => setNewProvider({ ...newProvider, email: val })} />
                        <Input title="Teléfono" placeholder="123456789" value={newProvider.telefono} event={(val) => setNewProvider({ ...newProvider, telefono: val })} />
                        <Button title="Agregar Proveedor" type="submit" />
                    </form>
                </div>

                {/* LISTA DE PROVEEDORES */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h3 className="text-xl font-semibold mb-4">Lista de Proveedores</h3>
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                                    <th className="p-2">Nombre</th>
                                    <th className="p-2">Contacto</th>
                                    <th className="p-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {providers.map((provider) => (
                                    <tr key={provider.id} className="border-b">
                                        <td className="p-2 font-medium text-gray-800">{provider.nombre}</td>
                                        <td className="p-2 text-sm text-gray-600">{provider.email}<br/>{provider.telefono}</td>
                                        <td className="p-2">
                                            <button onClick={() => handleDeleteProvider(provider.id)} className="bg-red-500 text-white px-3 py-1 text-xs rounded-full hover:bg-red-600">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {providers.length === 0 && <p className="text-center text-gray-500 p-4">No hay proveedores registrados.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderManager;