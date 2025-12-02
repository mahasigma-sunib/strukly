import type React from "react";

type cardSize = "sm" | "md" | "lg" | "xl";

interface CardProps {
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
}: CardProps) {
  return (
    <div
      className={`
        bg-[var(--fun-color-background)] shadow-md border border-[var(--fun-color-inactive)]
        transition-all duration-200
        m-4
        ${sizeClasses[size]}  ${className}
      `}
    >
      {children}
    </div>
  );
}
