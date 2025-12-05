import { type SVGProps } from "react";

interface EditIconProps extends SVGProps<SVGSVGElement> {}

export default function EditIcon(props: EditIconProps) {
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
        d="M14.3154 9.29921L15.0654 8.00017C15.3415 7.52187 15.1777 6.91028 14.6994 6.63414L13.8333 6.13414C13.355 5.858 12.7435 6.02187 12.4673 6.50017L11.7173 7.79921M14.3154 9.29921L9.73205 17.2378C9.62387 17.4252 9.45782 17.5724 9.25885 17.6574L7.87942 18.2466C7.57289 18.3776 7.22648 18.1776 7.1866 17.8466L7.00718 16.3574C6.9813 16.1426 7.02579 15.9252 7.13398 15.7378L11.7173 7.79921M14.3154 9.29921L11.7173 7.79921M12.2664 18.4463L17.2664 18.4463"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
}
