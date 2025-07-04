import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createInvoice } from '../api/apiService';
import { useNavigate } from 'react-router-dom';
import Button from './button';

const SalesCart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const [clienteNombre, setClienteNombre] = useState('Cliente General');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.precio, 0).toFixed(2);
    
    const handleFinalizeSale = async () => {
        setError('');
        setMessage('');
        if (cartItems.length === 0) {
            setError("El carrito está vacío.");
            return;
        }

        const invoiceData = {
            id_usuario: user.id,
            cliente_nombre: clienteNombre,
            detalle_venta: cartItems.map(item => ({
                inventario_id: item.inventario_id,
                cantidad: item.quantity
            }))
        };

        try {
            const response = await createInvoice(invoiceData);
            setMessage(`¡Venta completada! Factura #${response.data.nueva_factura_id} creada.`);
            clearCart();
            setTimeout(() => navigate('/dashboard/products'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.msg || 'Error al procesar la venta.');
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-center mb-6">Carrito de Compras</h2>
            
            {error && <p className="text-center mb-4 font-semibold text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
            {message && <p className="text-center mb-4 font-semibold text-blue-600 bg-blue-100 p-3 rounded-lg">{message}</p>}

            {cartItems.length === 0 && !message ? (
                <div className='text-center py-10'>
                    <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
                    <Button title="Ir al Catálogo" event={() => navigate('/dashboard/products')} className="mt-4"/>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.inventario_id} className="flex items-center bg-white p-4 rounded-lg shadow-md gap-4">
                                <img src={item.imagenes?.[0]?.url_imagen || 'https://placehold.co/100x100'} alt={item.nombre} className="w-24 h-24 object-cover rounded-md" />
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg">{item.nombre}</h3>
                                    <p className="text-sm text-gray-600">Talla: {item.talla}, Color: {item.color}</p>
                                    <p className="text-md font-semibold text-blue-600">${item.precio}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className='text-sm'>Cant:</label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.inventario_id, parseInt(e.target.value))}
                                        className="w-16 p-1 border rounded-md text-center"
                                        min="1"
                                        max={item.existencia}
                                    />
                                </div>
                                <button onClick={() => removeFromCart(item.inventario_id)} className="text-red-500 hover:text-red-700 p-2">
                                    <i className="fa-solid fa-trash-can fa-lg">🗑️</i>
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg shadow-lg h-fit">
                        <h3 className="text-xl font-bold border-b pb-2 mb-4">Resumen de la Venta</h3>
                        <div className="space-y-2 mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
                            <input
                                type="text"
                                value={clienteNombre}
                                onChange={(e) => setClienteNombre(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Nombre del cliente"
                            />
                        </div>
                        <div className="flex justify-between text-lg font-bold mt-2 border-t pt-2">
                            <span>Total</span>
                            <span>${total}</span>
                        </div>
                        <Button
                            title="Finalizar Compra"
                            event={handleFinalizeSale}
                            className="w-full mt-6"
                            disabled={cartItems.length === 0}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesCart;