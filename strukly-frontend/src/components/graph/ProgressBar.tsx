import React from "react";

type ProgressBarProps = {
  value: number;
  max: number;
  height?: number;
  showLabel?: boolean;
  className?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  height = 8,
  className = "",
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

  const bgColor = isOver
    ? "bg-red-500"
    : "bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400";

  return (
    <div className={`w-full ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(rawPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full bg-neutral-700 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className={`${bgColor} h-full transition-all`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
