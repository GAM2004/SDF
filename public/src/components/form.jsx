const Form = ({ event, children, className }) => {
    return (
        // Se eliminaron: w-11/12, md:w-4/5, lg:w-3/5 para que ocupe todo el ancho de su contenedor padre
        // Se añadió: w-full y mx-auto para asegurar centrado interno
        <form 
            onSubmit={event} 
            className={`${className} w-full mx-auto shadow-2xl p-6 rounded-2xl md:px-12 md:py-10`} 
        >
            {children}
        </form>
    );
}
export default Form;