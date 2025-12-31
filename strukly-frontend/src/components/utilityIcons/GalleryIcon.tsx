import { type SVGProps } from "react";

interface GalleryIconProps extends SVGProps<SVGSVGElement> {}

export default function GalleryIcon(props: GalleryIconProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1181_81)">
        <circle cx="16" cy="16" r="16" fill="currentColor" />
        <rect
          x="8.75"
          y="8.75"
          width="14.5"
          height="14.5"
          rx="3.25"
          fill="white"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M19.7939 14.508C20.3466 14.0266 21.1412 13.9402 21.7842 14.2922L22 14.4103V19.5002C21.9999 20.8808 20.8806 22.0002 19.5 22.0002H12.5C11.1194 22.0002 10.0001 20.8808 10 19.5002V18.673L11.9229 17.0158C12.4755 16.5393 13.2661 16.4554 13.9062 16.8058L15.749 17.8146C15.8409 17.8649 15.9543 17.8531 16.0332 17.7844L19.7939 14.508Z"
          fill="currentColor"
        />
        <circle cx="11.5" cy="11.5" r="1.5" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_1181_81">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
