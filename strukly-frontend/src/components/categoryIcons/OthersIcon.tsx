import { type SVGProps } from "react";

interface OthersIconProps extends SVGProps<SVGSVGElement> {}

export default function OthersIcon(props: OthersIconProps) {
  return (
    <svg
      width="40"
      height="43"
      viewBox="0 0 40 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="40" height="43" rx="15" fill="#A0A7AA" />
      <rect width="40" height="40" rx="15" fill="#BFBFBF" />
      <rect
        x="10.5"
        y="11.5"
        width="8"
        height="8"
        rx="2.5"
        fill="white"
        stroke="white"
      />
      <rect
        x="10.5"
        y="22.5"
        width="8"
        height="8"
        rx="2.5"
        fill="white"
        stroke="white"
      />
      <rect
        x="21.5"
        y="11.5"
        width="8"
        height="8"
        rx="2.5"
        fill="white"
        stroke="white"
      />
      <rect
        x="21.5"
        y="22.5"
        width="8"
        height="8"
        rx="4"
        fill="white"
        stroke="white"
      />
    </svg>
  );
}
