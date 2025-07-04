import { useState, useEffect } from 'react';
import { getCategories, createCategory, getSizes, createSize, getColors, createColor } from '../api/apiService';
import Input from './input';
import Button from './button';

const AttributeSection = ({ title, items, inputValue, onInputChange, onFormSubmit, placeholder, error, type }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
        
        <form onSubmit={onFormSubmit} className="flex flex-col gap-3 mb-4">
            <div>
                <Input
                    title={`Nombre de ${type}`}
                    value={inputValue}
                    event={onInputChange}
                    placeholder={placeholder}
                />
            </div>

            <Button title="Crear" type="submit" />
        </form>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="max-h-60 overflow-y-auto border rounded-lg bg-gray-50">
            {items.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {items.map(item => (
                        <li key={item.id} className="p-3 text-gray-700">{item.nombre}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 p-4">No hay {type.toLowerCase()}s registrados.</p>
            )}
        </div>
    </div>
);

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [error, setError] = useState({ category: '', size: '', color: '' });

    const fetchAttributes = async () => {
        try {
            const [catRes, sizeRes, colorRes] = await Promise.all([getCategories(), getSizes(), getColors()]);
            setCategories(catRes.data);
            setSizes(sizeRes.data);
            setColors(colorRes.data);
        } catch (err) {
            console.error("Error fetching attributes", err);
            setMessage({ type: 'error', text: 'No se pudieron cargar los atributos.' });
        }
    };

    useEffect(() => {
        fetchAttributes();
    }, []);

    const handleCreate = async (e, type) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setError({ category: '', size: '', color: '' });

        let promise, value, resetInput;

        switch (type) {
            case 'category':
                if (!newCategory) { setError(p => ({ ...p, category: "El nombre es obligatorio." })); return; }
                promise = createCategory({ nombre: newCategory });
                value = newCategory;
                resetInput = () => setNewCategory('');
                break;
            case 'size':
                if (!newSize) { setError(p => ({ ...p, size: "El nombre es obligatorio." })); return; }
                promise = createSize({ nombre: newSize });
                value = newSize;
                resetInput = () => setNewSize('');
                break;
            case 'color':
                if (!newColor) { setError(p => ({ ...p, color: "El nombre es obligatorio." })); return; }
                promise = createColor({ nombre: newColor });
                value = newColor;
                resetInput = () => setNewColor('');
                break;
            default: return;
        }

        try {
            await promise;
            setMessage({ type: 'success', text: `"${value}" creado con éxito.` });
            resetInput();
            await fetchAttributes();
        } catch (err) {
            setError(p => ({ ...p, [type]: `Error al crear. Puede que ya exista.` }));
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestionar Atributos del Producto</h2>
            
            {message.text && (
                <p className={`text-center mb-4 font-semibold p-3 rounded-lg ${message.type === 'success' ? 'text-blue-600 bg-blue-100' : 'text-red-600 bg-red-100'}`}>
                    {message.text}
                </p>
            )}

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                <AttributeSection
                    title="Categorías"
                    items={categories}
                    inputValue={newCategory}
                    onInputChange={setNewCategory}
                    onFormSubmit={(e) => handleCreate(e, 'category')}
                    placeholder="Ej: Camisetas"
                    error={error.category}
                    type="Categoría"
                />
                <AttributeSection
                    title="Tallas"
                    items={sizes}
                    inputValue={newSize}
                    onInputChange={setNewSize}
                    onFormSubmit={(e) => handleCreate(e, 'size')}
                    placeholder="Ej: M, L, XL"
                    error={error.size}
                    type="Talla"
                />
                <AttributeSection
                    title="Colores"
                    items={colors}
                    inputValue={newColor}
                    onInputChange={setNewColor}
                    onFormSubmit={(e) => handleCreate(e, 'color')}
                    placeholder="Ej: Rojo, Azul"
                    error={error.color}
                    type="Color"
                />
            </div>
        </div>
    );
};

export default CategoryManager;