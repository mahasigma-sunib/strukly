import React from "react";
import { CheckCircle2, ArrowUpCircle } from "lucide-react";
import EditIcon from "../utilityIcons/EditIcon";
import DeleteIcon from "../utilityIcons/DeleteIcon";
import ProgressBar from "../graph/ProgressBar";
import type { GoalItem } from "../../type/GoalItem";
import FlagIcon from "../utilityIcons/FlagIcon";

interface Props {
  goal: GoalItem;
  onDeposit: (goal: GoalItem) => void;
  onEdit: (goal: GoalItem) => void;
  onDelete: (id: string) => void;
  colorIdx?: number;
}

const GoalCard: React.FC<Props> = ({
  goal,
  onDeposit,
  onEdit,
  onDelete,
  colorIdx,
}) => {
  const colors = ["red", "blue", "green", "yellow", "purple"];

  return (
    <div
      key={goal.id}
      className={`bg-white rounded-[24px] p-5 shadow-sm border ${
        goal.isCompleted
          ? "border-emerald-100 bg-emerald-50/30"
          : "border-slate-100"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              goal.isCompleted
                ? "bg-emerald-100 text-emerald-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {goal.isCompleted ? (
              <CheckCircle2 size={24} />
            ) : (
              <FlagIcon
                width={32}
                className={`text-${
                  colors[colorIdx ? colorIdx % colors.length : 0]
                }-500`}
              />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-tight">
              {goal.name}
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Rp {goal.currentAmount.toLocaleString()} / Rp{" "}
              {goal.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onDeposit(goal)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <ArrowUpCircle size={20} />
          </button>
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
          >
            <EditIcon width={20} height={20} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
          >
            <DeleteIcon width={20} height={30} />
          </button>
        </div>
      </div>

      <ProgressBar value={goal.currentAmount} max={goal.price} height={8} />
    </div>
  );
};

export default GoalCard;
