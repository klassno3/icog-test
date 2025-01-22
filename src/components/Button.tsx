import React from "react";

interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type: "submit" | "reset" | "button" | undefined;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  onClick,
  type,
  className = "",
  disabled = false,
}) => {
  const baseStyles = `inline-flex items-center justify-center font-medium rounded-sm focus:outline-none`;

  const variantStyles = {
    primary: "bg-secondary text-white hover:bg-secondary/85   ",
    secondary: "bg-primary text-white hover:bg-primary/95 ",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1.5 md:px-3 md:py-1.5 text-sm ",
    md: "px-3 py-2 md:px-4 md:py-2.5 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}       } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
