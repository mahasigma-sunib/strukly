interface SquareButtonProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
}

export default function SquareButton({
  icon,
  label,
  sublabel,
  onClick,
}: SquareButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-2 flex flex-col items-start justify-center bg-background rounded-2xl transition-all h-18 w-full active:bg-border duration-300"
    >
      <div className="flex flex-row items-center gap-2">
        <div className="p-2">{icon}</div>
        <div className="flex flex-col items-start">
          <div className="text-text-primary text-regular font-bold">
            {label}
          </div>
          <div className="text-text-secondary text-sm">{sublabel}</div>
        </div>
      </div>
    </button>
  );
}
