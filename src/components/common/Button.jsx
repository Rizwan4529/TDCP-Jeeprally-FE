const Button = ({
  children,
  onClick = () => {},
  className = "",
  variant = "solid",
  ...rest
}) => {
  const baseStyles = `
    py-1 px-2
    md:px-12 md:py-2
    min-h-10
    rounded-full
    transition-all duration-300
    cursor-pointer
  `;

  // Variants
  const variants = {
    solid: `
      bg-black text-white
      border border-black
      hover:bg-white hover:text-black hover:border-black
    `,
    "solid-green": `
      bg-white text-accent
      border border-accent
      hover:bg-accent hover:text-white hover:border-accent
    `,
    "blue": `
      bg-[#4097F8] text-white
      border border-none
      hover:bg-white hover:text-black hover:border-black
    `,
    "solid-accent": `
      bg-accent text-white
      border border-accent
      hover:bg-white hover:text-accent hover:border-accent
    `,
    ghost: `
      bg-transparent text-white
      border border-white
      hover:bg-white hover:text-black hover:border-white
    `,
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
