interface SquareButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function SquareButton({
  icon,
  label,
  onClick,
}: SquareButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center bg-[var(--fun-color-border)] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 active:bg-[var(--fun-color-light-gray)] transition-all duration-300 h-30 w-full"
    >
      <div className="mb-3">{icon}</div>
      <div className="text-[var(--fun-color-text-secondary)] font-medium text-sm text-center">
        {label}
      </div>
    </button>
  );
}
