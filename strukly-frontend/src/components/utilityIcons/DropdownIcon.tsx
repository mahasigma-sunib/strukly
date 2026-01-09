import { type SVGProps } from "react";

interface DropDownIconProps extends SVGProps<SVGSVGElement> {}

export default function DropDownIcon(props: DropDownIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 8.00001L12 16L19 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
