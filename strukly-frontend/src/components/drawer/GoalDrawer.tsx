import Button from "../button/Button";

interface GoalDrawerProps {
  onAddSaving: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function GoalDrawer({
  onAddSaving,
  onEdit,
  onDelete,
  onClose,
}: GoalDrawerProps) {
  return (
    <div>
      <Button
        onClick={() => {
          onAddSaving();
          onClose();
        }}
      >
        Add Saving
      </Button>

      <Button
        onClick={() => {
          onEdit();
          onClose();
        }}
      >
        Update
      </Button>

      <Button
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        Delete
      </Button>
    </div>
  );
}
