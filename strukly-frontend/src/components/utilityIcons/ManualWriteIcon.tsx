import { type SVGProps } from "react";

interface ManualWriteIconProps extends SVGProps<SVGSVGElement> {}

export default function ManualWriteIcon(props: ManualWriteIconProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_1181_94)">
        <circle cx="16" cy="16" r="16" fill="currentColor" />
        <rect
          x="5.99075"
          y="9.21527"
          width="14.8174"
          height="17.4771"
          rx="4"
          transform="rotate(-15 5.99075 9.21527)"
          fill="white"
        />
        <rect
          x="9.63177"
          y="12.4151"
          width="8.73853"
          height="1.34439"
          rx="0.672194"
          transform="rotate(-15 9.63177 12.4151)"
          fill="currentColor"
        />
        <rect
          x="10.5016"
          y="15.6616"
          width="9.41072"
          height="1.34439"
          rx="0.672194"
          transform="rotate(-15 10.5016 15.6616)"
          fill="currentColor"
        />
        <rect
          x="11.3716"
          y="18.908"
          width="6.72194"
          height="1.34439"
          rx="0.672194"
          transform="rotate(-15 11.3716 18.908)"
          fill="currentColor"
        />
        <path
          d="M22.9373 14.0904L18.8456 18.3487C18.7136 18.486 18.6221 18.6597 18.5818 18.8494L18.2139 20.579C18.1364 20.943 18.4483 21.2676 18.7981 21.187L20.46 20.8041C20.6422 20.7622 20.8091 20.6669 20.9411 20.5296L25.0328 16.2712C25.6114 15.669 25.6114 14.6926 25.0328 14.0904C24.4541 13.4882 23.5159 13.4882 22.9373 14.0904Z"
          fill="currentColor"
          stroke="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_1181_94">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
