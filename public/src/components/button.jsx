const Button=({title, className, event , type})=>{
    return(
        <button onClick={event} type={type?type:"submit"} className={`bg-gradient-to-r from-pink-500 to-violet-700 hover:from-purple-700 hover:to-violet-900 px-4 py-2 rounded-lg text-white md:font-semibold md:text-lg md:px-6 md:py-3 lg:font-bold lg:px-8 lg:py-4 ${className}`} >{title}</button>
    )
}
export default Button;