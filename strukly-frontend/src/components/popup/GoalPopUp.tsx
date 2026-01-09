import React from "react";
import AddIcon from "../icons/AddIcon";
import EditIcon from "../utilityIcons/EditIcon";
import DeleteIcon from "../utilityIcons/DeleteIcon";
// import Button from "../button/Button";
import CloseIcon from "../utilityIcons/CloseIcon";
import { PlusIcon } from "lucide-react";

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
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 flex-col min-w-0">
          <div className="px-4 py-1">
            <p className="text-lg font-semibold text-inactive">Manage Goal</p>
          </div>
          {goalName && (
            <div className="px-4 py-1">
              <p className="text-2xl font-bold text-text-primary overflow-hidden whitespace-nowrap text-ellipsis">
                {goalName}
              </p>
            </div>
          )}
        </div>
        <div onClick={onClose} className="text-slate-500 mt-2 mr-2">
          <CloseIcon width={28} height={28} />
        </div>
      </div>

      <button
        onClick={onAddSaving}
        className="flex flex-row items-center gap-4 w-full p-3 rounded-2xl border-b-2 border-gray-200 active:bg-gray-200"
      >
        <div className="h-8 w-8 flex items-center justify-center">
          <PlusIcon className="w-6 h-6 text-text-primary" />
        </div>
        <span className="font-bold text-lg text-text-primary/80">
          Add Savings
        </span>
      </button>

      <button
        onClick={onEdit}
        className="flex flex-row items-center gap-4 w-full p-3 rounded-2xl border-b-2 border-gray-200 active:bg-gray-200"
      >
        <div className="h-8 w-8">
          <EditIcon className="w-8 h-8" />
        </div>
        <span className="font-bold text-lg text-text-primary/80">
          Edit Goal
        </span>
      </button>

      <button
        onClick={onDelete}
        className="flex flex-row items-center gap-4 w-full p-3 rounded-2xl active:bg-gray-200 text-status-error"
      >
        <div className="h-8 w-8">
          <DeleteIcon className="w-7 h-7" />
        </div>
        <span className="font-bold text-lg">Delete Goal</span>
      </button>
    </div>
  );
};

export default GoalPopUp;
