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
    const user = JSON.parse(sessionStorage.getItem("user"));
    const navigate = useNavigate();
    const { cartCount } = useCart();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => { 
        if (!isLogin || !user) navigate("/login"); 
    }, [isLogin, user, navigate]);
    
    if (!isLogin || !user) return null;
    
    const handleLogout = () => { 
        handleLogin(false); 
        sessionStorage.clear(); 
        navigate("/login"); 
    };

    const handleLinkClick = () => { 
        setIsMenuOpen(false); 
    };
    
    return (
        <div className="flex flex-col md:flex-row h-[100dvh] bg-gray-100 overflow-hidden">
            
            {/* --- SIDEBAR / MENU --- */}
            <section className={`
                bg-gradient-to-b from-purple-600 to-violet-800 text-white shadow-lg 
                flex flex-col transition-all duration-300 z-50
                /* Desktop */
                md:w-64 md:h-full md:relative md:translate-x-0
                /* Móvil */
                ${isMenuOpen ? 'absolute top-0 left-0 w-full h-full' : 'relative w-full h-auto'}
            `}>
                
                {/* Cabecera del Menú */}
                <div className="flex justify-between items-center p-4 md:mb-6">
                    <div className="flex gap-4 items-center w-full">
                        {/* CAMBIO: onClick solo en la imagen del logo */}
                        <img 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="rounded-full w-12 h-12 border-2 border-white/50 cursor-pointer hover:scale-105 transition-transform active:scale-95" 
                            src={logoEmpresa} 
                            alt="logo" 
                            title="Toca para abrir/cerrar menú"
                        />
                        
                        <div className="flex flex-col">
                            <p className="text-lg font-semibold cursor-default">{user.nombre || "Usuario"}</p>
                            {/* Texto informativo estático */}
                            <span className="text-xs text-violet-200 md:hidden">
                                {isMenuOpen ? "Menú Abierto" : "Panel de Control"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- LINKS DE NAVEGACIÓN --- */}
                <nav className={`
                    flex-col gap-1 px-4 pb-4 flex-grow overflow-y-auto
                    ${isMenuOpen ? 'flex animate-fade-in' : 'hidden'} 
                    md:flex md:animate-none
                `}>
                    
                    <Link onClick={handleLinkClick} to="/dashboard" className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20 transition-colors border border-transparent hover:border-white/10">
                        <i className="fa-solid fa-house w-6 text-center mr-2"></i>Inicio
                    </Link>

                    <Link to="cart" onClick={handleLinkClick} className="w-full flex justify-between items-center text-left p-3 font-bold rounded-lg bg-white/20 hover:bg-white/30 mb-4 shadow-sm border border-white/10 mt-2">
                        <span><i className="fa-solid fa-cart-shopping mr-2"></i>Ver Carrito</span>
                        {cartCount > 0 && (
                            <span className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <p className="text-violet-300 mt-2 border-t border-white/20 pt-2 font-bold text-xs uppercase tracking-wider">General</p>
                    
                    <Link onClick={handleLinkClick} className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20 transition-colors" to="products">
                        <i className="fa-solid fa-store w-6 text-center mr-2"></i>Catálogo
                    </Link>
                    <Link onClick={handleLinkClick} className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20 transition-colors" to="sales-history">
                        <i className="fa-solid fa-clock-rotate-left w-6 text-center mr-2"></i>Historial Ventas
                    </Link>
                    <Link onClick={handleLinkClick} className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20 transition-colors" to="stock-movements">
                        <i className="fa-solid fa-arrow-right-arrow-left w-6 text-center mr-2"></i>Movimientos
                    </Link>
                    <Link onClick={handleLinkClick} className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20 transition-colors" to="reports">
                        <i className="fa-solid fa-chart-line w-6 text-center mr-2"></i>Reportes
                    </Link>

                    <p className="text-violet-300 mt-4 border-t border-white/20 pt-2 font-bold text-xs uppercase tracking-wider">Gestión</p>
                    
                    <Link onClick={handleLinkClick} to="new-product" className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20 transition-colors">
                        <i className="fa-solid fa-plus w-6 text-center mr-2"></i>Nuevo Producto
                    </Link>
                    <Link onClick={handleLinkClick} to="providers" className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20 transition-colors">
                        <i className="fa-solid fa-truck w-6 text-center mr-2"></i>Compras / Prov.
                    </Link>
                    <Link onClick={handleLinkClick} to="categories" className="w-full text-left p-3 font-medium rounded-lg hover:bg-white/20 transition-colors">
                        <i className="fa-solid fa-tags w-6 text-center mr-2"></i>Atributos
                    </Link>

                    <div className="mt-auto pt-4 pb-20 md:pb-4">
                        <button onClick={handleLogout} className="w-full text-left p-3 font-medium rounded-lg bg-red-600/20 hover:bg-red-600 text-red-100 transition-colors border border-red-500/30">
                            <i className="fa-solid fa-right-from-bracket w-6 text-center mr-2"></i>Cerrar Sesión
                        </button>
                    </div>
                </nav>
            </section>

            <main className="flex-1 p-4 bg-gray-100 w-full relative overflow-y-auto h-full">
                <div className="min-h-full bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <Routes>
                        <Route path="/" element={
                            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 opacity-60 text-center p-6">
                                <i className="fa-solid fa-shop text-6xl mb-4 text-violet-400"></i>
                                <h2 className="text-2xl md:text-3xl font-light mb-2">Bienvenido, <span className="font-semibold text-violet-600">{user.nombre}</span>.</h2>
                                <p className="text-sm md:text-base">Selecciona una opción del menú para comenzar.</p>
                            </div>
                        } />
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