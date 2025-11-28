import GoalItem from "src/domain/entities/goal_item";
import z from "zod";

export const CreateGoalItemDTOSchema = z.object({
  name: z.string(),
  price: z.number().int().positive(),
});

export const UpdateGoalItemDTOSchema = z.object({
  name: z.string().optional(),
  price: z.number().int().positive().optional(),
});

export type CreateGoalItemDTO = z.infer<typeof CreateGoalItemDTOSchema>;
export type UpdateGoalItemDTO = z.infer<typeof UpdateGoalItemDTOSchema>;

export type GoalItemDTO = {
  id: string;
  name: string;
  price: number;
  deposited: number;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function goalItemToDTO(goalItem: GoalItem): GoalItemDTO {
  return {
    id: goalItem.id.value,
    name: goalItem.name,
    price: goalItem.price,
    deposited: goalItem.deposited,
    completed: goalItem.completed,
    completedAt: goalItem.completedAt?.toISOString() || null,
    createdAt: goalItem.createdAt.toISOString(),
    updatedAt: goalItem.updatedAt.toISOString(),
  };
}
