import { type SVGProps } from "react";

interface WhistleMascotProps extends SVGProps<SVGSVGElement> {}

export default function WhistleMascot(props: WhistleMascotProps) {
  return (
    <svg
      width="64"
      height="69"
      viewBox="0 0 64 69"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="64" height="69" rx="32" fill="#FFAA28" />
      <circle cx="32" cy="32" r="32" fill="#FFE432" />
      <path
        d="M20.7724 2.03386C22.8409 1.25903 25.1456 2.30819 25.9208 4.37663C26.6959 6.44532 25.6477 8.75093 23.579 9.52604C21.0544 10.472 18.7068 11.8363 16.6356 13.5622C14.9385 14.9763 12.4161 14.7474 11.0018 13.0505C9.58784 11.3534 9.8176 8.83086 11.5145 7.41667C14.2762 5.1154 17.4061 3.29516 20.7724 2.03386Z"
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
        transform="matrix(-1 0 0 1 53.9999 23)"
        fill="white"
      />
      <rect
        width="12.1939"
        height="3.37005"
        rx="1.68502"
        transform="matrix(-0.687773 0.725926 0.688364 0.725365 43.4305 27.1018)"
        fill="#2E2E2E"
      />
      <rect
        width="12.1939"
        height="3.35704"
        rx="1.67852"
        transform="matrix(-0.958592 -0.284784 0.233458 -0.972367 47.054 40.6248)"
        fill="#2E2E2E"
      />
      <circle
        cx="11.7857"
        cy="11.7857"
        r="11.7857"
        transform="matrix(-1 0 0 1 33.5714 23)"
        fill="white"
      />
      <rect
        width="12.194"
        height="3.37005"
        rx="1.68502"
        transform="matrix(0.687774 0.725925 -0.688365 0.725364 20.5695 27.1018)"
        fill="#2E2E2E"
      />
      <rect
        width="12.194"
        height="3.35704"
        rx="1.67852"
        transform="matrix(0.958592 -0.284782 -0.23346 -0.972366 16.946 40.6248)"
        fill="#2E2E2E"
      />
      <rect
        x="34.4323"
        y="50.6641"
        width="15.6359"
        height="11.48"
        rx="5.74001"
        transform="rotate(10.6073 34.4323 50.6641)"
        fill="#FF4848"
      />
      <path
        d="M30.5481 51.802C30.7345 50.8068 31.6924 50.1511 32.6876 50.3375L38.6232 51.4491C39.7233 51.6551 40.4402 52.7238 40.2136 53.8199L39.9265 55.2084C39.6596 56.4994 38.2385 57.1835 37.0629 56.5869L31.5205 53.7743C30.7943 53.4058 30.3982 52.6024 30.5481 51.802Z"
        fill="#FF4848"
      />
      <ellipse
        cx="38.1113"
        cy="57.1553"
        rx="3.1212"
        ry="4.01319"
        transform="rotate(10.6073 38.1113 57.1553)"
        fill="#D04848"
      />
    </svg>
  );
}
