import React from "react";
import AddIcon from "./icons/AddIcon";
import Button from "./button/Button";

interface Props {
  activeCount: number;
  onAdd: () => void;
}

const GoalsHeader: React.FC<Props> = ({ onAdd }) => {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between mb-8 p-5 rounded-b-3xl border-b-2 border-border bg-surface">
      <div>
        <h1 className="text-3xl font-bold ">Goals</h1>
        {/* <p className="text-sm font-bold text-active bg-secondary-hover/10 px-2 py-1 rounded-md inline-block mt-1">
            {activeCount} Active Targets
          </p> */}
      </div>
      <Button
        onClick={onAdd}
        // className="bg-[var(--fun-color-secondary)] p-3 rounded-2xl hover:scale-105 transition-transform flex items-center justify-center"
        className="rounded-2xl !p-3"
        variant="secondary"
        size="md"
      >
        <AddIcon width={22} height={22} />
      </Button>
    </div>
  );
};

export default GoalsHeader;
