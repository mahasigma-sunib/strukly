import { type SVGProps } from "react";

interface VehicleIconProps extends SVGProps<SVGSVGElement> {}

export default function VehicleIcon(props: VehicleIconProps) {
  return (
    <svg
      width="40"
      height="43"
      viewBox="0 0 40 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="40" height="43" rx="15" fill="#0F99D9" />
      <rect width="40" height="40" rx="15" fill="#26BAFF" />
      <path
        d="M10.1284 26.7511L9.47239 20.8688C9.34023 19.6838 10.2677 18.6471 11.4601 18.6471H29.0321C30.2245 18.6471 31.152 19.6838 31.0198 20.8688L30.3638 26.7511C30.2508 27.7636 29.3949 28.5294 28.3761 28.5294H12.1161C11.0973 28.5294 10.2413 27.7636 10.1284 26.7511Z"
        fill="white"
      />
      <path
        d="M28.8516 20.1177L27.3896 11.8267C27.3054 11.3487 26.8906 11.0005 26.4053 11.0005H14.0869C13.6016 11.0005 13.1868 11.3487 13.1025 11.8267L11.6406 20.1177H28.8516Z"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M10.4492 26.0588H14.123V30C14.123 30.5523 13.6753 31 13.123 31H11.4492C10.8969 31 10.4492 30.5523 10.4492 30V26.0588Z"
        fill="white"
      />
      <path
        d="M26.3691 26.0588H30.043V30C30.043 30.5523 29.5953 31 29.043 31H27.3691C26.8169 31 26.3691 30.5523 26.3691 30V26.0588Z"
        fill="white"
      />
      <rect
        width="3.68187"
        height="2.46526"
        rx="1.23263"
        transform="matrix(0.864134 0.503261 -0.496746 0.867896 9.22461 16.1765)"
        fill="white"
      />
      <rect
        width="3.68187"
        height="2.46526"
        rx="1.23263"
        transform="matrix(-0.864134 0.503261 0.496746 0.867896 30.7754 16.1765)"
        fill="white"
      />
      <ellipse
        cx="13.5108"
        cy="22.9706"
        rx="1.83691"
        ry="1.85294"
        fill="#26BAFF"
      />
      <ellipse
        cx="26.9815"
        cy="22.9706"
        rx="1.83691"
        ry="1.85294"
        fill="#26BAFF"
      />
    </svg>
  );
}
