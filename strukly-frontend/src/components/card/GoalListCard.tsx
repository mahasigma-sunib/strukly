import { useRef } from "react";

import ProgressBar from "../../components/graph/ProgressBar";

import CheckIcon from "../../components/utilityIcons/CheckIcon";
import FlagIcon from "../../components/utilityIcons/FlagIcon";

import type { GoalItem } from "../../type/GoalItem";

interface GoalListProps {
  goal: GoalItem;
  idx: number | null;
  onOpenDrawer: (goal: GoalItem) => void;
}

export default function GoalList({ goal, idx, onOpenDrawer }: GoalListProps) {
  const colorClasses = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
  ];
  const progress = (goal.currentAmount / goal.price) * 100;

  const timerRef = useRef<number | null>(null);

  const handleStart = () => {
    timerRef.current = setTimeout(() => {
      onOpenDrawer(goal);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 600);
  };

  const handleEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      <div className="flex justify-between w-full items-start mb-4">
        <div className="flex flex-row gap-2 items-center w-full">
          <div className="mx-2 rounded-2xl flex items-center justify-center">
            {goal.isCompleted ? (
              <CheckIcon width={40} height={40} className="mx-1" />
            ) : (
              <FlagIcon
                width={44}
                height={44}
                className={`${
                  colorClasses[(idx ?? 0) % colorClasses.length]
                } -rotate-20`}
              />
            )}
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-xl font-bold text-text-primary">{goal.name}</p>

            <div className="flex flex-row w-full justify-between items-center">
              <p className="text-lg font-semibold text-inactive">
                {(() => {
                  if (progress === 100) {
                    return "Goals reached!";
                  } else if (progress >= 75 && progress < 100)
                    return <span>You're almost there!</span>;
                  else if (progress >= 50 && progress < 75)
                    return <span>Halfway done, nice!</span>;
                  else if (progress >= 25 && progress < 50)
                    return <span>Let's keep it up!</span>;
                  else if (progress < 25 && progress >= 0)
                    return <span>Let's get started!</span>;
                })()}
              </p>

              <p className="text-lg font-bold text-text-disabled/90 mr-1">
                {Math.ceil(progress)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProgressBar
        value={goal.currentAmount}
        max={goal.price}
        height={12}
        barColor={
          goal.isCompleted ? "bg-category-transportation" : "bg-status-success"
        }
      />

      <div className="mt-4 flex flex-row justify-between items-center">
        <p className="font-bold text-base text-text-disabled/70">
          Rp {goal.currentAmount.toLocaleString()}
        </p>
        <p className="font-bold text-base text-text-disabled/70">
          Rp {goal.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
