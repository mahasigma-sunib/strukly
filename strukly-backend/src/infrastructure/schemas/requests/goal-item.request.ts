import { z } from "zod";

// ============ Path Params ============

export const GoalItemIdParamSchema = z.object({
  goalItemID: z.string().uuid("Invalid goal item ID format"),
});

// ============ Request Bodies ============

export const CreateGoalItemRequestSchema = z.object({
  name: z.string().min(1, "Name is required").describe("The name of the goal"),
  price: z
    .number()
    .int()
    .positive("Price must be positive")
    .describe("The target price for the goal"),
});

export const UpdateGoalItemRequestSchema = z.object({
  name: z.string().min(1).optional().describe("The name of the goal"),
  price: z
    .number()
    .int()
    .positive("Price must be positive")
    .optional()
    .describe("The target price for the goal"),
});

export const DepositGoalItemRequestSchema = z.object({
  amount: z
    .number()
    .int()
    .positive("Amount must be positive")
    .describe("The amount to deposit towards the goal"),
});

// ============ Types ============

export type GoalItemIdParam = z.infer<typeof GoalItemIdParamSchema>;
export type CreateGoalItemRequest = z.infer<typeof CreateGoalItemRequestSchema>;
export type UpdateGoalItemRequest = z.infer<typeof UpdateGoalItemRequestSchema>;
export type DepositGoalItemRequest = z.infer<typeof DepositGoalItemRequestSchema>;
