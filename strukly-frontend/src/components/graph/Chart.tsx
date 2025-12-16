type Props = {
  totalSpent: number;
  totalBudget: number;
  size?: number;
};

export default function OverviewChart({
  totalSpent,
  totalBudget,
  size = 160,
}: Props) {
  if (totalBudget <= 0) {
    return (
      <div className="flex flex-col items-center gap-2 p-2">
        <div className="text-sm text-[var(--fun-color-text-primary)]">
          Set budgets to see an overview
        </div>
      </div>
    );
  }

  const rawPercent = (totalSpent / totalBudget) * 100;
  const percent = Math.round(rawPercent);
  const clampedPercent = Math.max(0, Math.min(100, rawPercent));

  // 2/3 arc at the top
  const arcAngle = 240;
  const arcRatio = arcAngle / 360;
  const strokeWidth = Math.max(8, Math.round(size * 0.075));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const visibleLength = circumference * arcRatio;
  const gapLength = circumference - visibleLength;

  const isOver = rawPercent > 100;
  const filledLength = isOver ? visibleLength : (clampedPercent / 100) * visibleLength;

  // background track draws the fixed 2/3 arc
  const trackDash = `${visibleLength} ${gapLength}`;
  // foreground draws only the filled portion (rest is treated as gap)
  const fillDash = `${filledLength} ${circumference - filledLength}`;

  const rotateDeg = -90 - arcAngle / 2;
  const fgColor = isOver ? "#ef4444" : "#34d399";
  const bgColor = "#374151";

  return (
    <div className="flex items-center gap-4 p-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <g transform={`translate(${size / 2},${size / 2}) rotate(${rotateDeg})`}>
            <circle
              r={radius}
              fill="none"
              stroke={bgColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={trackDash}
              strokeDashoffset={0}
            />
            <circle
              r={radius}
              fill="none"
              stroke={fgColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={fillDash}
              strokeDashoffset={0}
              style={{ transition: "stroke-dasharray 0.35s ease, stroke 0.2s" }}
            />
          </g>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className={`text-lg font-semibold ${isOver ? "text-red-500" : "text-emerald-400"}`}>
            {percent}%
          </div>
          <div className="text-xs text-[var(--fun-color-text-secondary)] -mt-1">of total budget used</div>
        </div>
      </div>
    </div>
  );
}