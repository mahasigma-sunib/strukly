import React from "react";

type ProgressBarProps = {
  value: number;
  max: number;
  height?: number;
  showLabel?: boolean;
  className?: string;
  barColor?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  height = 8,
  className = "",
  barColor = "bg-secondary",
}) => {
  if (max <= 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-xs text-gray-400">Invalid budget</div>
      </div>
    );
  }

  const rawPercent = (value / max) * 100;
  const clampedPercent = Math.max(0, Math.min(100, rawPercent));
  const isOver = rawPercent > 100;

  const finalBarColor = isOver ? "bg-red-500" : barColor;

  return (
    <div className={`w-full ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(rawPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full bg-inactive/30 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className={`${finalBarColor} h-full rounded-full transition-all duration-500`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
