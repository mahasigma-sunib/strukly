import React from "react";
import AddIcon from "../icons/AddIcon";
import EditIcon from "../utilityIcons/EditIcon";
import DeleteIcon from "../utilityIcons/DeleteIcon";
import Button from "../button/Button";
import CloseIcon from "../utilityIcons/CloseIcon";

type GoalPopUpProps = {
  goalName?: string;
  onAddSaving: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

const GoalPopUp: React.FC<GoalPopUpProps> = ({
  goalName,
  onAddSaving,
  onEdit,
  onDelete,
  onClose,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {goalName && (
        <div className="px-4 py-2 border-b border-border/50">
          <p className="text-sm font-semibold text-text-disabled text-center">
            {goalName}
          </p>
        </div>
      )}

      <Button onClick={onClose} className="text-slate-500">
        <CloseIcon width={20} height={20} />
      </Button>

      <button
        onClick={onAddSaving}
        className="flex flex-row items-center gap-4 w-full p-3 rounded-2xl hover:bg-slate-50 transition-colors"
      >
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <AddIcon className="w-6 h-6 fill-primary" />
        </div>
        <span className="font-bold text-lg text-text-primary">Add Savings</span>
      </button>

      <div className="h-[1px] w-full bg-border/50 my-1" />

      <button
        onClick={onEdit}
        className="flex flex-row items-center gap-4 w-full p-3 rounded-2xl hover:bg-slate-50 transition-colors"
      >
        <div className="bg-text-primary/5 p-2 rounded-xl text-text-primary">
          <EditIcon className="w-6 h-6" />
        </div>
        <span className="font-bold text-lg text-text-primary">Edit Goal</span>
      </button>

      <div className="h-[1px] w-full bg-border/50 my-1" />

      <button
        onClick={onDelete}
        className="flex flex-row items-center gap-4 w-full p-3 rounded-2xl hover:bg-red-50 transition-colors text-status-error"
      >
        <div className="bg-status-error/10 p-2 rounded-xl">
          <DeleteIcon className="w-6 h-6" />
        </div>
        <span className="font-bold text-lg">Delete Goal</span>
      </button>
    </div>
  );
};

export default GoalPopUp;
