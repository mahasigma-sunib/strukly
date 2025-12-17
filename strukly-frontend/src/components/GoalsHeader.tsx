import React from "react";
import AddIcon from "./icons/AddIcon";
import Button from "./button/Button";

interface Props {
  activeCount: number;
  onAdd: () => void;
}

const GoalsHeader: React.FC<Props> = ({ activeCount, onAdd }) => {
  return (
    <header className="p-6 sticky top-0 z-10 bg-white rounded-b-3xl shadow-[0_0_20px_5px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold ">Goals</h1>
          <p className="text-sm font-bold text-active bg-secondary-hover/10 px-2 py-1 rounded-md inline-block mt-1">
            {activeCount} Active Targets
          </p>
        </div>
        <Button
          onClick={onAdd}
          // className="bg-[var(--fun-color-secondary)] p-3 rounded-2xl hover:scale-105 transition-transform flex items-center justify-center"
          variant="primary"
          size="md"
        >
          <AddIcon width={20} height={20} />
        </Button>
      </div>
    </header>
  );
};

export default GoalsHeader;
