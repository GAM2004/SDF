import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/form';
import Input from '../components/input';
import Button from '../components/button';
import { loginUser, createUser } from '../api/apiService';
import logoEmpresa from '../assets/BeeStore.jpg';

const Login = ({ handle }) => {
    sessionStorage.clear();
    const navigate = useNavigate();
    const [isCreateAcount, setIsCreateAcount] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [apellido, setApellido] = useState('');
    const [clave, setClave] = useState('');
    const [errorMensaje, setErrorMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    const saveSesion = (userData) => {
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('isLogin', 'true');
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setErrorMensaje('');
        setLoading(true);

        if (!usuario || !clave) {
            setErrorMensaje("Por favor, ingrese usuario y contraseña.");
            setLoading(false);
            return;
        }

        try {
            const response = await loginUser({ nombre: usuario, clave: clave });
            if (response && response.data) {
                saveSesion(response.data);
                handle(true);
                navigate("/dashboard");
            } else {
                setErrorMensaje("Respuesta inesperada del servidor.");
            }
        } catch (error) {
            console.error("Error de login:", error);
            if (error.response) {
                setErrorMensaje(error.response.data.msg || "Error: Usuario o contraseña incorrectos.");
            } else if (error.request) {
                setErrorMensaje("No se pudo conectar con el servidor. Verifique su conexión.");
            } else {
                setErrorMensaje("Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMensaje('');
        setLoading(true);

        if (!usuario || !apellido || !clave) {
            setErrorMensaje("Todos los campos son obligatorios.");
            setLoading(false);
            return;
        }

        try {
            const newUserData = { nombre: usuario, apellido, clave };
            await createUser(newUserData);
            await handleLogin();
        } catch (error) {
            console.error("Error de registro:", error);
             if (error.response) {
                setErrorMensaje(error.response.data.msg || "Error al crear el usuario. Puede que ya exista.");
            } else if (error.request) {
                setErrorMensaje("No se pudo conectar con el servidor para crear el usuario.");
            } else {
                setErrorMensaje("Ocurrió un error inesperado durante el registro.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // min-h-screen asegura que cubra todo el alto del celular.
        // py-8 agrega espacio arriba y abajo para que no se pegue a los bordes en pantallas bajitas.
        <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-violet-800 p-4 py-8">
            <div className='w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <Form className="w-full p-6 md:p-8" event={isCreateAcount ? handleSignup : handleLogin}>
                    <div className='text-center mb-6'>
                        <div className="mx-auto w-20 h-20 mb-4 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-violet-50">
                            <img className="w-16 h-16 rounded-full object-cover" src={logoEmpresa} alt="Logo" />
                        </div>
                        
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {isCreateAcount ? "Crear Nueva Cuenta" : "Bienvenido de Nuevo"}
                        </h1>
                        <p className="text-gray-500 text-sm px-2">
                            {isCreateAcount ? "Completa los datos para registrarte." : "Ingresa tus credenciales para continuar."}
                        </p>
                    </div>

                    {/* space-y-6 aumenta la separación vertical para mejorar el 'largo' y la experiencia táctil */}
                    <div className="space-y-6">
                        <Input title="Nombre de Usuario" placeholder="tu-usuario" value={usuario} event={setUsuario} />
                        
                        {isCreateAcount && <Input title="Apellido" placeholder="tu-apellido" value={apellido} event={setApellido} />}
                        
                        <Input title="Contraseña" placeholder="........" type="password" value={clave} event={setClave} />
                    </div>
                    
                    {errorMensaje && (
                        <div className="mt-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center font-medium">
                            {errorMensaje}
                        </div>
                    )}
                    
                    <div className='mt-8'>
                        <Button 
                            className="w-full text-lg font-bold shadow-lg py-3 transition-transform active:scale-95" 
                            title={loading ? "Procesando..." : (isCreateAcount ? "Crear Cuenta" : "Iniciar Sesión")} 
                            disabled={loading} 
                        />
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-600 pb-2">
                        {isCreateAcount ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
                        <button 
                            type="button" 
                            className="font-bold text-violet-700 hover:text-violet-900 underline decoration-2 underline-offset-2 transition-colors ml-1"
                            onClick={() => {setIsCreateAcount(!isCreateAcount); setErrorMensaje('')}}
                        >
                            {isCreateAcount ? "Iniciar Sesión" : "Crear Cuenta"}
                        </button>
                    </div>
                </Form>
            </div>
        </main>
    );
};

export default Login;