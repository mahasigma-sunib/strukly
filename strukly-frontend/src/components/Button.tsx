import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "text"; // button variant
  size?: "sm" | "md" | "lg"; // ukuran button
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  // Variants style
  const baseStyles =
    "rounded-xl font-inter font-medium shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";

  const variantStyles: Record<string, string> = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-secondary text-white hover:bg-secondary-hover",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
    danger: "bg-red text-white hover:bg-red-hover",
    text: "bg-transparent text-primary font-bold! hover:underline shadow-none!",
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
