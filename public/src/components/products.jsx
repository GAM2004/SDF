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
            case 'price-asc':
                return a.precio - b.precio;
            case 'price-desc':
                return b.precio - a.precio;
            case 'name-desc':
                return b.nombre.localeCompare(a.nombre);
            case 'name-asc':
            default:
                return a.nombre.localeCompare(b.nombre);
        }
    }) : [];

    return (
        <>
            <div className="flex w-full relative px-4 justify-between items-center mb-4">
                <h2 className="text-xl lg:text-3xl font-semibold py-4">Catálogo de Productos</h2>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            <option value="name-asc">Ordenar por: Nombre (A-Z)</option>
                            <option value="name-desc">Ordenar por: Nombre (Z-A)</option>
                            <option value="price-asc">Ordenar por: Precio (Menor a Mayor)</option>
                            <option value="price-desc">Ordenar por: Precio (Mayor a Menor)</option>
                        </select>
                    </div>
                    <Link className="px-4 py-2 rounded-lg bg-violet-500 text-white font-semibold hover:bg-violet-600 transition-colors" to="/dashboard/new-product">
                        + Agregar Producto
                    </Link>
                    <button onClick={() => navigate('/dashboard/cart')} className="relative px-4 py-2 rounded-lg bg-violet-500 text-white font-semibold hover:bg-violet-600 transition-colors">
                        <i className="fa-solid fa-cart-shopping">🛒</i>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
            <div className="flex-grow md:overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 p-4">
                    {sortedProducts.length > 0 ? (
                        sortedProducts.map(product => <Product key={product.id} product={product} />)
                    ) : <p>Cargando productos...</p>}
                </div>
            </div>
        </>
    );
};
export default Products;