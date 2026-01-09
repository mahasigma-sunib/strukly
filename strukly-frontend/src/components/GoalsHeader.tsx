import React from "react";
import AddIcon from "./icons/AddIcon";
import Button from "./button/Button";

interface Props {
  activeCount: number;
  onAdd: () => void;
}

const GoalsHeader: React.FC<Props> = ({ onAdd }) => {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between mb-4 px-5 py-4 border-b-2 border-border bg-surface">
      <div>
        <h1 className="text-3xl font-bold ">Goals</h1>
      </div>
      <Button
        onClick={onAdd}
        className="
              !rounded-2xl 
              !font-bold 
              active:translate-y-[4px]
              !transition-all
              flex flex-row gap-1
              text-base
              justify-center
              items-center
              !py-2
              !px-3
              !mb-1
            "
        variant="blue"
        size="md"
      >
        <div className="flex flex-row items-center justify-center gap-2">
          <AddIcon width={16} height={16} />
          <p className="text-white text-base font-bold">Add Goals</p>
        </div>
      </Button>
    </div>
  );
};

export default GoalsHeader;
