import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Products from "../components/products";
import ProductDetail from "../components/ProductDetail";
import EditProduct from "../components/EditProduct";
import NewProduct from "../components/new-product";
import SalesHistory from "../components/sales-history";
import ReportsView from "../components/ReportsView";
import StockMovements from "../components/StockMovements";
import CategoryManager from "../components/CategoryManager";
import ProviderManager from "../components/ProviderManager";
import SalesCart from "../components/SalesCart";
import logoEmpresa from "../assets/BeeStore.jpg";
import { useCart } from '../context/CartContext';

const Dashboard = ({ isLogin, handleLogin }) => {
    const isMobile = window.innerWidth < 768;
    const [isMenu, setIsMenu] = useState(!isMobile);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const navigate = useNavigate();
    const { cartCount } = useCart();

    useEffect(() => { if (!isLogin || !user) navigate("/login"); }, [isLogin, user, navigate]);
    
    if (!isLogin || !user) return null;
    
    const handleLogout = () => { handleLogin(false); sessionStorage.clear(); navigate("/login"); };
    const handleLinkClick = () => { if (isMobile) setIsMenu(false); };
    
    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            <section className={`md:w-64 md:h-full p-4 bg-gradient-to-b from-purple-600 to-violet-800 flex flex-col shadow-lg text-white ${isMenu ? 'h-full' : 'h-auto'}`}>
                 <div className="w-full flex gap-4 items-center mb-6">
                    <img className="rounded-full w-12 h-12 border-2 border-white/50" src={logoEmpresa} alt="logo privado" />
                    <div><p className="text-lg font-semibold">{user.nombre || "Usuario"}</p></div>
                    <i onClick={() => setIsMenu(!isMenu)} className="fa-solid fa-bars text-white text-3xl ml-auto mr-2 md:hidden cursor-pointer"></i>
                </div>
                {isMenu && (
                    <nav className="flex flex-col gap-1 flex-grow">
                        <Link to="cart" onClick={handleLinkClick} className="w-full flex justify-between items-center text-left p-3 font-bold rounded-lg bg-white/20 hover:bg-white/30 mb-4">
                           <span><i className="fa-solid fa-cart-shopping mr-2"></i>Ver Carrito</span>
                           {cartCount > 0 && <span className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">{cartCount}</span>}
                        </Link>
                        <p className="text-violet-300 mt-2 border-t border-white/20 pt-2 font-bold text-xs uppercase">General</p>
                        <Link onClick={handleLinkClick} className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20" to="products">Catálogo</Link>
                        <Link onClick={handleLinkClick} className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20" to="sales-history">Historial de Ventas</Link>
                        <Link onClick={handleLinkClick} className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20" to="stock-movements">Movimientos de Stock</Link>
                        <Link onClick={handleLinkClick} className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20" to="reports">Reportes</Link>
                        <p className="text-violet-300 mt-4 border-t border-white/20 pt-2 font-bold text-xs uppercase">Gestión</p>
                        <Link onClick={handleLinkClick} to="new-product" className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20">Nuevo Producto</Link>
                        <Link onClick={handleLinkClick} to="providers" className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20">Compras y Proveedores</Link>
                        <Link onClick={handleLinkClick} to="categories" className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20">Categorías</Link>
                        <button onClick={handleLogout} className="w-full text-left p-3 font-medium rounded-lg hover:bg-red-500/80 mt-auto"><i className="fa-solid fa-right-from-bracket mr-2"></i>Cerrar Sesión</button>
                    </nav>
                )}
            </section>
            <main className="flex-grow p-4 overflow-y-auto">
                <div className="h-full bg-white rounded-xl shadow-md p-4 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<h2 className="text-center text-2xl mt-10">Bienvenido al Dashboard, {user.nombre}.</h2>} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/products/edit/:id" element={<EditProduct />} />
                        <Route path="/new-product" element={<NewProduct />} />
                        <Route path="/sales-history" element={<SalesHistory />} />
                        <Route path="/stock-movements" element={<StockMovements />} />
                        <Route path="/reports" element={<ReportsView />} />
                        <Route path="/categories" element={<CategoryManager />} />
                        <Route path="/providers" element={<ProviderManager />} />
                        <Route path="/cart" element={<SalesCart />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};
export default Dashboard;