import { type SVGProps } from "react";

interface CloseIconProps extends SVGProps<SVGSVGElement> {}

export default function CloseIcon(props: CloseIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="24.3333"
        y="6.00012"
        width="2.35702"
        height="25.9272"
        rx="1.17851"
        transform="rotate(45 24.3333 6.00012)"
        fill="currentColor"
      />
      <rect
        x="26"
        y="24.3334"
        width="2.35702"
        height="25.9272"
        rx="1.17851"
        transform="rotate(135 26 24.3334)"
        fill="currentColor"
      />
    </svg>
  );
}
