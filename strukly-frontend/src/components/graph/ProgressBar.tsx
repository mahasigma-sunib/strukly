interface ProgressBarProps {
  value: number;
  max: number;
  height?: "h-1" | "h-2" | "h-3" | "h-4";
  color?: string; // Tailwind class ONLY
  className?: string;
}

export default function ProgressBar({
  value,
  max,
  height = "h-2",
  color = "bg-category-others",
  className = "",
}: ProgressBarProps) {
  if (max <= 0) return null;

  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative w-full ${height} rounded-full bg-neutral-700 overflow-hidden`}
      >
        {/* Fill */}
        <div
          className={`relative h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
