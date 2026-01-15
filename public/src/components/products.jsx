import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../api/apiService";
import Product from "./product";
import { useCart } from "../context/CartContext";

const Products = () => {
    const [products, setProducts] = useState(null);
    const [sortOrder, setSortOrder] = useState('name-asc');
    const { cartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        getProducts().then(res => setProducts(res.data)).catch(err => console.error(err));
    }, []);

    const sortedProducts = products ? [...products].sort((a, b) => {
        switch (sortOrder) {
            case 'price-asc': return a.precio - b.precio;
            case 'price-desc': return b.precio - a.precio;
            case 'name-desc': return b.nombre.localeCompare(a.nombre);
            case 'name-asc':
            default: return a.nombre.localeCompare(b.nombre);
        }
    }) : [];

    return (
        <div className="h-full flex flex-col">
            {/* Encabezado adaptable con flex-wrap */}
            <div className="flex flex-wrap w-full relative px-2 md:px-4 justify-between items-center mb-4 gap-y-4">
                <h2 className="text-xl lg:text-3xl font-semibold py-2">Catálogo de Productos</h2>
                
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                    <div className="relative">
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-3 py-2 text-sm md:text-base rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors outline-none focus:border-violet-500"
                        >
                            <option value="name-asc">Nombre (A-Z)</option>
                            <option value="name-desc">Nombre (Z-A)</option>
                            <option value="price-asc">Precio: Menor a Mayor</option>
                            <option value="price-desc">Precio: Mayor a Menor</option>
                        </select>
                    </div>
                    
                    {/* BOTÓN AGREGAR PRODUCTO: Texto completo siempre visible */}
                    <Link 
                        className="px-3 py-2 md:px-4 text-sm md:text-base rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors whitespace-nowrap shadow-sm" 
                        to="/dashboard/new-product"
                    >
                        <i className="fa-solid fa-plus mr-2"></i>Agregar Producto
                    </Link>
                    
                    {/* BOTÓN CARRITO: Restaurado a fondo gris/texto violeta para máxima visibilidad */}
                    <button 
                        onClick={() => navigate('/dashboard/cart')} 
                        className="relative px-3 py-2 md:px-4 rounded-lg bg-gray-200 text-violet-700 font-bold hover:bg-gray-300 transition-colors border border-gray-300"
                        title="Ver Carrito"
                    >
                        <i className="fa-solid fa-cart-shopping text-lg"></i>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Grid de Productos */}
            <div className="flex-grow overflow-y-auto pb-20 md:pb-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-5 p-2 md:p-4">
                    {sortedProducts.length > 0 ? (
                        sortedProducts.map(product => <Product key={product.id} product={product} />)
                    ) : (
                        <p className="col-span-full text-center text-gray-500 mt-10">Cargando productos...</p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Products;