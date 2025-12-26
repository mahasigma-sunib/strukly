import type React from "react";

type cardSize = "sm" | "md" | "lg" | "xl";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: cardSize;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<cardSize, string> = {
  sm: "p-2 rounded-lg text-sm",
  md: "p-4 rounded-xl text-base",
  lg: "p-6 rounded-2xl text-lg",
  xl: "p-8 rounded-3xl text-xl",
};

export default function Card({
  size = "md",
  children,
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={`
        bg-surface border-border border-2 shadow-[0_4px_0_0_var(--color-border)]
        transition-all duration-200
        m-4
        ${sizeClasses[size]}  ${className}
      `}
    >
      {children}
    </div>
  );
} 
