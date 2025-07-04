import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, variant, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.inventario_id === variant.inventario_id);
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > variant.existencia) {
                    alert(`No puedes agregar más. Stock disponible: ${variant.existencia}`);
                    return prevItems;
                }
                return prevItems.map(item =>
                    item.inventario_id === variant.inventario_id ? { ...item, quantity: newQuantity } : item
                );
            } else {
                const newItem = {
                    ...product,
                    ...variant,
                    quantity,
                };
                return [...prevItems, newItem];
            }
        });
    };

    const removeFromCart = (inventario_id) => {
        setCartItems(prevItems => prevItems.filter(item => item.inventario_id !== inventario_id));
    };

    const updateQuantity = (inventario_id, newQuantity) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.inventario_id === inventario_id) {
                if (newQuantity > 0 && newQuantity <= item.existencia) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};