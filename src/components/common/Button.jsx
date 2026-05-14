const Button = ({
  children,
  onClick = () => { },
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
      bg-brand-green text-white
      border border-brand-green
      hover:bg-brand-green-hover hover:text-white hover:border-brand-green-hover
    `,
    "blue": `
      bg-[#4097F8] text-white
      border border-none
      hover:bg-white hover:text-black hover:border-black
    `,
    "solid-accent": `
      bg-secondary text-black
      border border-secondary
      hover:bg-primary hover:text-white hover:border-primary
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
