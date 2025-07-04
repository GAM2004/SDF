import { useState, useEffect } from 'react';
import { getStockMovements } from '../api/apiService';

const StockMovements = () => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                setLoading(true);
                const response = await getStockMovements();
                setMovements(response.data);
            } catch (err) { 
                setError("No se pudo cargar el historial de movimientos."); 
                console.error(err);
            } 
            finally { setLoading(false); }
        };
        fetchMovements();
    }, []);

    const getMovementTypeClass = (type) => {
        if (type.toLowerCase().includes('venta')) return 'text-red-600';
        if (type.toLowerCase().includes('compra')) return 'text-green-600';
        if (type.toLowerCase().includes('manual')) return 'text-blue-600';
        return 'text-gray-700';
    };

    if (loading) return <p className="text-center mt-8 font-semibold text-lg">Cargando movimientos...</p>;
    if (error) return <p className="text-center mt-8 font-semibold text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Movimientos de Stock</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">Fecha</th>
                            <th className="px-6 py-3">Producto</th>
                            <th className="px-6 py-3">Detalle</th>
                            <th className="px-6 py-3">Tipo</th>
                            <th className="px-6 py-3 text-center">Cantidad</th>
                            <th className="px-6 py-3">Usuario</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {movements.map((mov) => (
                            <tr key={mov.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(mov.fecha).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{mov.nombre_producto}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{mov.talla} / {mov.color}</td>
                                <td className={`px-6 py-4 whitespace-nowrap font-semibold ${getMovementTypeClass(mov.tipo_movimiento)}`}>{mov.tipo_movimiento}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-center font-bold ${mov.cantidad > 0 ? 'text-green-600' : 'text-red-600'}`}>{mov.cantidad > 0 ? `+${mov.cantidad}` : mov.cantidad}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{mov.nombre_usuario}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {movements.length === 0 && !loading && <p className="text-center text-gray-500 p-6">No hay movimientos registrados.</p>}
            </div>
        </div>
    );
};

export default StockMovements;