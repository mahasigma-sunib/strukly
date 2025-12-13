import { type SVGProps } from "react";

interface DeleteIconProps extends SVGProps<SVGSVGElement> {}

export default function DeleteIcon(props: DeleteIconProps) {
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
        d="M6 8H18M7 10L7.70348 16.3313C7.87229 17.8506 9.15648 19 10.6851 19H13.3149C14.8435 19 16.1277 17.8506 16.2965 16.3313L17 10M10.5 16V11M13.5 16V11M9 8C9 7 9.6 5 12 5C14.4 5 15 7 15 8"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
}
