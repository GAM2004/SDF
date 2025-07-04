import './styles/app.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import { CartProvider } from './context/CartContext';

function App() {
  const [isLogin, setIsLogin] = useState(sessionStorage.getItem('isLogin') === 'true');
  
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login handle={setIsLogin} />} />
          <Route path='/dashboard/*' element={isLogin ? <Dashboard isLogin={isLogin} handleLogin={setIsLogin} /> : <Navigate to="/login" />} />
          <Route path='*' element={<Navigate to={isLogin ? "/dashboard" : "/login"} />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
export default App;