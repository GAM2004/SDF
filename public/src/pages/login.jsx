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
        <main className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-violet-700 p-4 sm:p-6 lg:p-8">
            <div className='w-full max-w-lg'>
                <Form className="bg-white/95 text-black backdrop-blur-sm" event={isCreateAcount ? handleSignup : handleLogin}>
                    <div className='text-center mb-8'>
                        <img className="mx-auto rounded-full w-24 h-24 border-4 border-violet-300 shadow-lg" src={logoEmpresa} alt="Logo de la empresa" />
                        <h1 className="font-sans text-3xl font-bold text-center mt-4 md:text-4xl">{isCreateAcount ? "Crear Nueva Cuenta" : "Bienvenido de Nuevo"}</h1>
                        <p className="text-gray-600 mt-2">{isCreateAcount ? "Completa los datos para registrarte." : "Ingresa tus credenciales para continuar."}</p>
                    </div>

                    <div className="space-y-4">
                        <Input title="Nombre de Usuario" placeholder="tu-usuario" value={usuario} event={setUsuario} />
                        {isCreateAcount && <Input title="Apellido" placeholder="tu-apellido" value={apellido} event={setApellido} />}
                        <Input title="Contraseña" placeholder="••••••••" type="password" value={clave} event={setClave} />
                    </div>
                    
                    {errorMensaje && <p className="text-red-600 text-sm mt-4 text-center font-semibold bg-red-100 p-3 rounded-md border border-red-200">{errorMensaje}</p>}
                    
                    <div className='mt-6'>
                      <Button className="w-full text-lg" title={loading ? "Procesando..." : (isCreateAcount ? "Crear Cuenta" : "Iniciar Sesión")} disabled={loading} />
                    </div>

                    <p className='mt-8 text-center text-sm'>
                        {isCreateAcount ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "} 
                        <button type="button" className='font-semibold cursor-pointer underline text-violet-700 hover:text-purple-700 bg-transparent border-none p-0' onClick={() => {setIsCreateAcount(!isCreateAcount); setErrorMensaje('')}}>
                            {isCreateAcount ? "Iniciar Sesión" : "Crear Cuenta"}
                        </button>
                    </p>
                </Form>
            </div>
        </main>
    );
};

export default Login;