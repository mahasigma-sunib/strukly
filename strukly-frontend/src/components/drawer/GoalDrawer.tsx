import type Button from "../button/Button";

import type { GoalItem } from "../../type/GoalItem";

interface GoalDrawerProps {
  goal: GoalItem | null;
}

export default function GoalDrawer({ goal }: GoalDrawerProps) {
  return (
    <div>
      <Button
        onClick={() => {
          handleUpdate();
          setSelectedGoal(null);
        }}
      >
        Add Saving
      </Button>
      <Button>Update</Button>
      <Button>Delete</Button>
    </div>
  );
}
