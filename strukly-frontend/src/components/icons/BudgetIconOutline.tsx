import { type SVGProps } from "react";

interface BudgetIconOutlineProps extends SVGProps<SVGSVGElement> {}

// Example usage:
// <BudgetIconOutline className="text-primary" width={24} height={24} />
export default function BudgetIconOutline(props: BudgetIconOutlineProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11 2C17.0751 2 22 6.92487 22 13C22 19.0751 17.0751 24 11 24C4.92487 24 0 19.0751 0 13C0 6.92487 4.92487 2 11 2ZM10 4.05664C5.50014 4.55417 2 8.36751 2 13C2 17.9706 6.02944 22 11 22C15.6325 22 19.4458 18.4999 19.9434 14H12.5C11.1193 14 10 12.8807 10 11.5V4.05664ZM12 11.5C12 11.7761 12.2239 12 12.5 12H19.9434C19.4821 7.82853 16.1715 4.51786 12 4.05664V11.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
