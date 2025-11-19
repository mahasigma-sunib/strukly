import z from "zod";

export const CreateGoalItemDTOSchema = z.object({
    name: z.string(),
    price: z.number(),
});

export type CreateGoalItemDTO = z.infer<typeof CreateGoalItemDTOSchema>;