const Button2 = ({ children, className = "", ...props }) => {
  return (
    <button 
      className={`hidden sm:inline-block px-4 py-1 rounded-xl text-white font-semibold 
          bg-linear-to-r from-[#7D4DF4] to-[#A589FD] shadow-md shadow-[#7D4DF4]/40 
          hover:opacity-90 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button2;


