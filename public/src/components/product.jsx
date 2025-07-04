import { Link } from "react-router-dom";

const Product = ({ product }) => {
    const { id, nombre, precio, img, stock_total } = product;
    return (
        <Link to={`/dashboard/products/${id}`}>
            <article className={`text-sm md:text-base w-full min-h-full relative ${Number(stock_total) > 0 ? "opacity-100" : "opacity-40"} rounded-lg bg-gray-50 overflow-hidden border hover:shadow-xl transition-shadow duration-300 group`}>
                <div className="w-full h-48 bg-white overflow-hidden">
                    <img className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" src={img || 'https://placehold.co/600x400?text=Sin+Imagen'} alt={nombre} />
                </div>
                <div className="flex flex-col p-3 h-32 justify-around">
                    <p className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">{nombre}</p>
                    <p>Precio: ${precio}</p>
                    <div className="flex justify-between items-center">
                        <p>Stock: <span className={`px-2 py-1 rounded text-white text-xs ${stock_total < 15 ? "bg-red-500" : stock_total <= 30 ? "bg-yellow-400" : "bg-green-500"}`}>{stock_total || 0}</span></p>
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs">Ver Detalles</span>
                    </div>
                </div>
            </article>
        </Link>
    );
};
export default Product;