import { type SVGProps } from "react";

interface ShoppingIconProps extends SVGProps<SVGSVGElement> {}

export default function ShoppingIcon(props: ShoppingIconProps) {
  return (
    <svg
      width="40"
      height="43"
      viewBox="0 0 40 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="40" height="43" rx="15" fill="#FC5BBD" />
      <rect width="40" height="40" rx="15" fill="#FF87D1" />
      <path
        d="M10.5226 27.5506L12.5985 13.8502C12.6725 13.3613 13.0927 13 13.5872 13H26.4128C26.9073 13 27.3275 13.3613 27.4015 13.8502L29.4774 27.5506C29.7524 29.3658 28.3471 31 26.5112 31H13.4888C11.6529 31 10.2476 29.3658 10.5226 27.5506Z"
        fill="white"
        stroke="white"
      />
      <path
        d="M17 14V12C17 10.3431 18.3431 9 20 9C21.6569 9 23 10.3431 23 12V14"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M23 16L23 17C23 18.6569 21.6569 20 20 20C18.3431 20 17 18.6569 17 17L17 16"
        stroke="#FF87D1"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
