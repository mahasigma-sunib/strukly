import { z } from "zod";

export const GoalItemResponseSchema = z.object({
  id: z.string().uuid().describe("The unique identifier of the goal"),
  name: z.string().describe("The name of the goal"),
  price: z.number().int().describe("The target price for the goal"),
  deposited: z.number().int().describe("The amount deposited so far"),
  completed: z.boolean().describe("Whether the goal has been completed"),
  completedAt: z.string().datetime().nullable().describe("When the goal was completed"),
  createdAt: z.string().datetime().describe("When the goal was created"),
  updatedAt: z.string().datetime().describe("When the goal was last updated"),
});

export type GoalItemResponse = z.infer<typeof GoalItemResponseSchema>;

// Wrapper responses
export const GoalItemCreatedResponseSchema = z.object({
  message: z.string().describe("Success message"),
  goal: GoalItemResponseSchema,
});

export const GoalItemDetailResponseSchema = z.object({
  goal: GoalItemResponseSchema,
});

export const GoalItemListResponseSchema = z.object({
  goalItems: z.array(GoalItemResponseSchema).describe("List of goal items"),
});

export type GoalItemCreatedResponse = z.infer<typeof GoalItemCreatedResponseSchema>;
export type GoalItemDetailResponse = z.infer<typeof GoalItemDetailResponseSchema>;
export type GoalItemListResponse = z.infer<typeof GoalItemListResponseSchema>;
