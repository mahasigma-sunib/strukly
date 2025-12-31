import { type SVGProps } from "react";

interface BackIconProps extends SVGProps<SVGSVGElement> {}

export default function BackIcon(props: BackIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 11.5L18 11.5249M6 11.5L11.7581 6M6 11.5L11.7581 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
