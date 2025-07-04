import { useState, useEffect } from 'react';
import { getRecords } from '../api/apiService';

const SalesHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);
                const response = await getRecords();
                setRecords(response.data);
            } catch (err) {
                console.error("Error fetching sales history:", err);
                setError("No se pudo cargar el historial de ventas. Por favor, verifica la conexión con el servidor.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    if (loading) {
        return <p className="text-center mt-8 font-semibold text-lg">Cargando historial de ventas...</p>;
    }

    if (error) {
        return <p className="text-center mt-8 font-semibold text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>;
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Historial de Ventas</h2>

            {records.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">Aún no se han registrado ventas.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Factura #</th>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Cliente</th>
                                <th className="px-6 py-3">Producto</th>
                                <th className="px-6 py-3">Detalle (Talla/Color)</th>
                                <th className="px-6 py-3 text-center">Cantidad</th>
                                <th className="px-6 py-3 text-right">Precio Unit.</th>
                                <th className="px-6 py-3 text-right">Total</th>
                                <th className="px-6 py-3">Vendedor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {records.map((record, index) => (
                                <tr key={`${record.factura_id}-${index}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-violet-700">{record.factura_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(record.fecha_creacion).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{record.cliente_nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{record.nombre_producto}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{record.talla} / {record.color}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">{record.cantidad}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">${Number(record.precio_unitario).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">${Number(record.total_linea).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{record.nombre_usuario}</td>
                                 </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SalesHistory;