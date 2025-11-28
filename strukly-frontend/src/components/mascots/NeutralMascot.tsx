import { type SVGProps } from "react";

interface NeutralMascotProps extends SVGProps<SVGSVGElement> {}

export default function NeutralMascot(props: NeutralMascotProps) {
  return (
    <svg
      width={64}
      height={69}
      viewBox="0 0 64 69"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="64" height="69" rx="32" fill="#FFAA28" />
      <circle cx="32" cy="32" r="32" fill="#FFE432" />
      <path
        d="M20.7723 2.03386C22.8409 1.25903 25.1456 2.30819 25.9208 4.37663C26.6959 6.44532 25.6477 8.75093 23.579 9.52604C21.0544 10.472 18.7068 11.8363 16.6356 13.5622C14.9385 14.9763 12.416 14.7474 11.0018 13.0505C9.58781 11.3534 9.81757 8.83086 11.5145 7.41667C14.2761 5.1154 17.4061 3.29516 20.7723 2.03386Z"
        fill="white"
      />
      <circle cx="32" cy="32" r="24" fill="#FFC606" />
      <path
        opacity="0.25"
        d="M43.8115 2.25195C52.8876 5.85874 59.9207 13.4983 62.7021 22.959L22.959 62.7021C13.4984 59.9207 5.85977 52.8875 2.25293 43.8115L43.8115 2.25195Z"
        fill="white"
      />
      <circle
        cx="11.7857"
        cy="11.7857"
        r="11.7857"
        transform="matrix(-1 0 0 1 53.9999 20)"
        fill="white"
      />
      <circle
        cx="6.28571"
        cy="6.28571"
        r="6.28571"
        transform="matrix(-1 0 0 1 48.4999 25.5)"
        fill="#2E2E2E"
      />
      <circle
        cx="11.7857"
        cy="11.7857"
        r="11.7857"
        transform="matrix(-1 0 0 1 33.5714 20)"
        fill="white"
      />
      <circle
        cx="6.28571"
        cy="6.28571"
        r="6.28571"
        transform="matrix(-1 0 0 1 28.0714 25.5)"
        fill="#2E2E2E"
      />
    </svg>
  );
}
