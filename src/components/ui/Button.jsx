const Button2 = ({ children, className = "", ...props }) => {
  return (
    <button 
      className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-xl text-white font-semibold 
          bg-linear-to-r from-[#7D4DF4] to-[#A589FD] shadow-md shadow-[#7D4DF4]/40 
          hover:opacity-90 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button2;


