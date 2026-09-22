import { describe, expect, it } from "vitest";
import { calculateBudgetStatus } from "./budgetStatus";

describe("calculateBudgetStatus", () => {
  it("returns a positive remaining when spending is under budget", () => {
    expect(calculateBudgetStatus(100_000, 40_000)).toEqual({
      remaining: 60_000,
      overBy: 0,
      isOverBudget: false,
    });
  });

  it("returns zero remaining when spending matches the budget", () => {
    expect(calculateBudgetStatus(100_000, 100_000)).toEqual({
      remaining: 0,
      overBy: 0,
      isOverBudget: false,
    });
  });

  it("reports remaining below zero and the overage when spending exceeds the budget", () => {
    expect(calculateBudgetStatus(100_000, 130_000)).toEqual({
      remaining: -30_000,
      overBy: 30_000,
      isOverBudget: true,
    });
  });
});
