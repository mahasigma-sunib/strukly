import { FlagIcon } from "lucide-react";

interface GoalListProps {
  name: string;
  price: number;
  currentAmount: number;
  isCompleted: boolean;
}

export default function GoalList({
  name,
  price,
  currentAmount,
  isCompleted,
}: GoalListProps) {
  const colors = ["red", "blue", "green", "yellow", "purple"];
  const randNumber = Math.random(); // randNumber to determine the color of the flag
  const progress = (goal.currentAmount / goal.price) * 100;
  return (
    <div>
      <div className="flex justify-between w-full items-start mb-4">
        <div className="flex flex-row gap-2 items-center w-full">
          <div className="mx-2 rounded-2xl flex items-center justify-center">
            <FlagIcon
              width={44}
              height={44}
              className={`text-${
                colors[randNumber % colors.length]
              }-500 -rotate-20`}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-xl font-bold text-text-primary">{goal.name}</p>

            <div className="flex flex-row w-full justify-between items-center">
              <p className="text-lg font-semibold text-inactive">
                {(() => {
                  if (progress >= 75) return <span>You're almost there!</span>;
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

        <div className="flex gap-1 ">
          <button
            onClick={() => {
              setSelectedGoal(goal);
              setActiveModal("deposit");
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <ArrowUpCircle size={20} />
          </button>
          <button
            onClick={() => {
              setSelectedGoal(goal);
              setFormData({
                name: goal.name,
                price: goal.price,
              });
              setActiveModal("edit");
            }}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
          >
            <EditIcon width={20} height={20} />
          </button>
          <button
            onClick={() => handleDelete(goal.id)}
            className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
          >
            <DeleteIcon width={20} height={30} />
          </button>
        </div>
      </div>

      <ProgressBar
        value={goal.currentAmount}
        max={goal.price}
        height={12}
        barColor="bg-category-transportation"
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
