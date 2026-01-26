import ProgressBar from "../../components/graph/ProgressBar";
import CheckIcon from "../../components/utilityIcons/CheckIcon";
import FlagIcon from "../../components/utilityIcons/FlagIcon";
import type { GoalItem } from "../../type/GoalItem";

interface GoalListProps {
  goal: GoalItem;
  idx: number | null;
  onHold: (goal: GoalItem) => void;
}

export default function GoalList({ goal, idx, onHold }: GoalListProps) {
  const colorClasses = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
  ];
  
  const progress = (goal.deposit / goal.price) * 100;

  const handleClick = () => {
    onHold(goal);
    
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer active:opacity-80 transition-all select-none"
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
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-xl font-bold text-text-primary overflow-hidden whitespace-nowrap text-ellipsis">
              {goal.name}
            </p>

            <div className="flex flex-row w-full justify-between items-center">
              <p className="text-lg font-semibold text-inactive">
                {(() => {
                  if (progress === 100) return "Goals reached!";
                  if (progress >= 75) return <span>You're almost there!</span>;
                  if (progress >= 50) return <span>Halfway done, nice!</span>;
                  if (progress >= 25) return <span>Let's keep it up!</span>;
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
        value={goal.deposit}
        max={goal.price}
        height={12}
        barColor={
          goal.isCompleted ? "bg-status-success" : "bg-category-transportation"
        }
      />

      <div className="mt-4 flex flex-row justify-between items-center">
        <p className="font-bold text-base text-text-disabled/70">
          Rp {goal.deposit.toLocaleString()}
        </p>
        <p className="font-bold text-base text-text-disabled/70">
          Rp {goal.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}