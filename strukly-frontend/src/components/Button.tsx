import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "blue"
    | "green"
    | "danger"
    | "text"; // button variant
  size?: "sm" | "md" | "lg"; // ukuran button
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "tracking-wider",
  ...props
}) => {
  // Base style (menambahkan transisi dan efek tekan)
  const baseStyles =
    "rounded-2xl font-inter font-bold transition-all duration-100 ease-out focus:outline-none cursor-pointer active:translate-y-1 ";

  // Warna kustom (Sesuaikan HEX gelap untuk bayangan)
  const variantStyles: Record<string, string> = {
    primary:
      "bg-primary text-white hover:bg-primary-hover shadow-[0_4px_0_0_var(--color-primary-shadow)] active:shadow-none active:bg-primary",

    secondary:
      "bg-secondary text-white hover:bg-secondary-hover shadow-[0_4px_0_0_var(--color-secondary-shadow)] active:shadow-none active:bg-secondary",

    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-none active:translate-y-0 active:shadow-none active:scale-100",

    green:
      "bg-[#58CC02] text-white shadow-[0_4px_0_0_#4CB200] active:shadow-none ",

    blue: "bg-[#1CB0F6] text-white shadow-[0_4px_0_0_#039be5] active:shadow-none ",

    danger:
      "bg-red text-white hover:bg-red-hover shadow-[0_4px_0_0_#991B1B] active:shadow-none",

    text: "bg-transparent text-primary font-bold hover:underline shadow-none active:translate-y-0 active:scale-100",
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-5 text-lg",
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
