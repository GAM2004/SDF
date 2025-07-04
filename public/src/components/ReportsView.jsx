import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
    getMostSoldReport,
    getLowStockReport,
    getGeneralSalesReport,
    getSaleDateRange,
    getRecords,
    getStockMovements
} from '../api/apiService';
import Button from './button';
import Input from './input';

const ReportsView = () => {
    const today = new Date().toISOString().split('T')[0];

    const [gsStartDate, setGsStartDate] = useState('');
    const [gsEndDate, setGsEndDate] = useState('');
    const [msStartDate, setMsStartDate] = useState('');
    const [msEndDate, setMsEndDate] = useState('');

    const [generalReportData, setGeneralReportData] = useState(null);
    const [mostSoldData, setMostSoldData] = useState([]);
    const [lowStockData, setLowStockData] = useState([]);
    const [stockLimit, setStockLimit] = useState(10);

    const [salesHistory, setSalesHistory] = useState([]);
    const [stockMovements, setStockMovements] = useState([]);
    const [showSalesPreview, setShowSalesPreview] = useState(false);
    const [showStockPreview, setShowStockPreview] = useState(false);

    const salesRef = useRef(null);
    const stockRef = useRef(null);
    const generalRef = useRef(null);
    const mostSoldRef = useRef(null);
    const lowStockRef = useRef(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() + userTimezoneOffset).toISOString().split('T')[0];
    };

    useEffect(() => {
        const fetchDateRange = async () => {
            try {
                const response = await getSaleDateRange();
                const { minDate, maxDate } = response.data;
                const formattedMin = formatDate(minDate || today);
                const formattedMax = formatDate(maxDate || today);

                setGsStartDate(formattedMin);
                setGsEndDate(formattedMax);
                setMsStartDate(formattedMin);
                setMsEndDate(formattedMax);
            } catch (err) {
                setError("Error al cargar el rango de fechas para los reportes.");
                console.error(err);
            }
        };
        fetchDateRange();
    }, []);

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const [salesRes, stockMovRes] = await Promise.all([
                    getRecords(),
                    getStockMovements(),
                ]);
                setSalesHistory(salesRes.data);
                setStockMovements(stockMovRes.data);
            } catch (err) {
                setError("Error al cargar el historial de ventas o movimientos.");
                console.error(err);
            }
        };
        fetchHistoryData();
    }, []);

    const generateReport = async (reportType) => {
        setLoading(true);
        setError('');
        try {
            if (reportType === 'general') {
                if (!gsStartDate || !gsEndDate) {
                    setError("Seleccione un rango de fechas.");
                    setLoading(false);
                    return;
                }
                const res = await getGeneralSalesReport({ fecha_inicio: gsStartDate, fecha_fin: gsEndDate });
                setGeneralReportData(res.data);
            } else if (reportType === 'mostSold') {
                if (!msStartDate || !msEndDate) {
                    setError("Seleccione un rango de fechas.");
                    setLoading(false);
                    return;
                }
                const res = await getMostSoldReport({ fecha_inicio: msStartDate, fecha_fin: msEndDate });
                setMostSoldData(res.data);
            }
        } catch (err) {
            setError("Error al generar el reporte.");
        } finally {
            setLoading(false);
        }
    };

    const handleLowStockReport = async () => {
        setLoading(true);
        setError('');
        setLowStockData([]);
        try {
            const response = await getLowStockReport({ limite: stockLimit });
            setLowStockData(response.data);
        } catch (err) {
            setError("Error al generar el reporte de stock bajo.");
        } finally {
            setLoading(false);
        }
    };

    const exportPdf = async (ref, fileName) => {
        if (!ref.current) return;
        setLoading(true);
        try {
            const canvas = await html2canvas(ref.current, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "pt", "a4", true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = pdfHeight;
            let position = 0;
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight, '', 'FAST');
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, '', 'FAST');
                heightLeft -= pageHeight;
            }
            pdf.save(fileName);
        } catch (e) {
            setError("Error al exportar a PDF.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h2 className="text-3xl font-bold text-center">Módulo de Reportes</h2>
            {loading && <p className="text-center font-semibold text-blue-600">Procesando...</p>}
            {error && <p className="text-center text-red-500 font-bold bg-red-100 p-2 rounded-lg">{error}</p>}

            {/* Reporte General de Ventas */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Reporte General de Ventas</h3>
                <div className="flex flex-wrap items-end gap-4 mb-4">
                    <Input title="Fecha de Inicio" type="date" value={gsStartDate} event={setGsStartDate} />
                    <Input title="Fecha de Fin" type="date" value={gsEndDate} event={setGsEndDate} />
                    <Button title="Generar Reporte" event={() => generateReport('general')} />
                </div>
                {generalReportData && (
                    <div className="bg-gray-50 border p-4 rounded-lg mt-4">
                        <div className="flex justify-end mb-4">
                            <Button title="🖨️ Exportar a PDF" event={() => exportPdf(generalRef, 'reporte_ventas_general.pdf')} />
                        </div>
                        <div ref={generalRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                            <div className="bg-green-100 p-4 rounded-lg">
                                <p className="text-lg text-green-800 font-semibold">Ingresos Totales</p>
                                <p className="text-3xl font-bold text-green-600">${Number(generalReportData.totalRevenue).toFixed(2)}</p>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-lg">
                                <p className="text-lg text-blue-800 font-semibold">Número de Ventas</p>
                                <p className="text-3xl font-bold text-blue-600">{generalReportData.numberOfSales}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Productos Más Vendidos */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Productos Más Vendidos por Fecha</h3>
                <div className="flex flex-wrap items-end gap-4 mb-4">
                    <Input title="Fecha de Inicio" type="date" value={msStartDate} event={setMsStartDate} />
                    <Input title="Fecha de Fin" type="date" value={msEndDate} event={setMsEndDate} />
                    <Button title="Generar Reporte" event={() => generateReport('mostSold')} />
                </div>
                {mostSoldData.length > 0 && (
                    <div className="bg-gray-50 border p-4 rounded-lg mt-4">
                        <div className="flex justify-end mb-4">
                            <Button title="🖨️ Exportar a PDF" event={() => exportPdf(mostSoldRef, 'productos_mas_vendidos.pdf')} />
                        </div>
                        <div ref={mostSoldRef} className="max-h-80 overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto (Talla, Color)</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Vendido</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {mostSoldData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.nombre} ({item.talla}, {item.color})</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center font-bold">{item.total_vendido}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Productos con Stock Bajo */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Reporte de Productos con Stock Bajo</h3>
                <div className="flex flex-wrap items-end gap-4 mb-4">
                    <Input title="Mostrar productos con stock menor o igual a:" type="number" value={stockLimit} event={setStockLimit} />
                    <Button title="Generar Reporte" event={handleLowStockReport} />
                </div>
                {lowStockData.length > 0 && (
                    <div className="bg-gray-50 border p-4 rounded-lg mt-4">
                        <div className="flex justify-end mb-4">
                            <Button title="🖨️ Exportar a PDF" event={() => exportPdf(lowStockRef, 'productos_stock_bajo.pdf')} />
                        </div>
                        <div ref={lowStockRef} className="max-h-80 overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto (Talla, Color)</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stock Actual</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {lowStockData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.nombre_producto} ({item.talla}, {item.color})</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-center font-bold ${item.existencia <= 5 ? 'text-red-600' : 'text-yellow-600'}`}>{item.existencia}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Historial de Ventas */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Historial Completo de Ventas</h3>
                <div className="mb-4">
                    <Button title={showSalesPreview ? "Ocultar Vista Previa" : "Vista Previa para PDF"} event={() => setShowSalesPreview(!showSalesPreview)} />
                </div>
                {showSalesPreview && (
                    <div className="bg-gray-50 border p-4 rounded-lg">
                        <div className="flex justify-end mb-4">
                            <Button title="🖨️ Exportar a PDF" event={() => exportPdf(salesRef, 'historial_ventas.pdf')} />
                        </div>
                        <div ref={salesRef} className="p-2 max-h-96 overflow-y-auto">
                            <h2 className="text-2xl font-bold text-center mb-4">Historial de Ventas</h2>
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-100 text-xs uppercase sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">Fact. #</th>
                                        <th className="px-4 py-2 text-left">Fecha</th>
                                        <th className="px-4 py-2 text-left">Cliente</th>
                                        <th className="px-4 py-2 text-left">Producto</th>
                                        <th className="px-4 py-2 text-center">Cant.</th>
                                        <th className="px-4 py-2 text-right">Total</th>
                                        <th className="px-4 py-2 text-left">Vendedor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {salesHistory.length > 0 ? salesHistory.map((r, i) => (
                                        <tr key={`${r.factura_id}-${i}`}>
                                            <td className="p-2 font-bold">{r.factura_id}</td>
                                            <td className="p-2">{new Date(r.fecha_creacion).toLocaleDateString()}</td>
                                            <td className="p-2">{r.cliente_nombre}</td>
                                            <td className="p-2">{r.nombre_producto} ({r.talla}, {r.color})</td>
                                            <td className="p-2 text-center">{r.cantidad}</td>
                                            <td className="p-2 text-right font-semibold">${Number(r.total_linea).toFixed(2)}</td>
                                            <td className="p-2">{r.nombre_usuario}</td>
                                        </tr>
                                    )) : <tr><td colSpan="7" className="text-center py-4 text-gray-500">No hay historial de ventas.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Historial de Movimientos de Stock */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Historial de Movimientos de Stock</h3>
                <div className="mb-4">
                    <Button title={showStockPreview ? "Ocultar Vista Previa" : "Vista Previa para PDF"} event={() => setShowStockPreview(!showStockPreview)} />
                </div>
                {showStockPreview && (
                    <div className="bg-gray-50 border p-4 rounded-lg">
                        <div className="flex justify-end mb-4">
                            <Button title="🖨️ Exportar a PDF" event={() => exportPdf(stockRef, 'historial_movimientos_stock.pdf')} />
                        </div>
                        <div ref={stockRef} className="p-2 max-h-96 overflow-y-auto">
                            <h2 className="text-2xl font-bold text-center mb-4">Historial de Movimientos de Stock</h2>
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-100 text-xs uppercase sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Fecha</th>
                                        <th className="px-4 py-2 text-left">Producto</th>
                                        <th className="px-4 py-2 text-left">Tipo de Movimiento</th>
                                        <th className="px-4 py-2 text-center">Cantidad</th>
                                        <th className="px-4 py-2 text-left">Usuario</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {stockMovements.length > 0 ? stockMovements.map((m, i) => (
                                        <tr key={i}>
                                            <td className="p-2">{new Date(m.fecha_movimiento).toLocaleString()}</td>
                                            <td className="p-2">{m.nombre_producto} ({m.talla}, {m.color})</td>
                                            <td className="p-2">{m.tipo_movimiento}</td>
                                            <td className="p-2 text-center font-bold">{m.cantidad}</td>
                                            <td className="p-2">{m.nombre_usuario}</td>
                                        </tr>
                                    )) : <tr><td colSpan="5" className="text-center py-4 text-gray-500">No hay movimientos de stock.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsView;