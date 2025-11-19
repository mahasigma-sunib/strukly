import GoalItem from "src/domain/entities/goal_item";
import z from "zod";

export const CreateGoalItemDTOSchema = z.object({
    name: z.string(),
    price: z.number(),
});

export type CreateGoalItemDTO = z.infer<typeof CreateGoalItemDTOSchema>;

export interface GoalItemDTO {
    id: string;
    userID: string;
    name: string;
    price: number;
    deposited: number;
    completed: boolean;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export function toGoalItemDTO(goalItem: GoalItem): GoalItemDTO {
    return {
        id: goalItem.id.value,
        userID: goalItem.userID.value,
        name: goalItem.name,
        price: goalItem.price,
        deposited: goalItem.deposited,
        completed: goalItem.completed,
        completedAt: goalItem.completedAt,
        createdAt: goalItem.createdAt,
        updatedAt: goalItem.updatedAt,
    };
}