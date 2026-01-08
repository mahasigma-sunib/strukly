interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  ariaLabel?: string;
}

export default function Toggle({ enabled, onChange, ariaLabel }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      onClick={() => onChange(!enabled)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none
        ${enabled ? "bg-sky-400" : "bg-gray-200"}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm
          ${enabled ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}
