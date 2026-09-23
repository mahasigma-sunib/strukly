import { describe, it, expect, vi, type Mocked } from "vitest";
import BudgetService from "../domain/services/budget_service";
import IBudgetHistoryRepository from "../domain/repositories/budget_history_repository";
import UserRepository from "../domain/repositories/user_repository";
import UserID from "../domain/values/user_id";

describe("BudgetService.getCurrentUserBudget", () => {
  it("puts the user id string in the not-found error, not [object Object]", async () => {
    const userRepository: Mocked<UserRepository> = {
      findByEmail: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
    };
    const budgetHistoryRepository = {
      create: vi.fn(),
      findByUserDate: vi.fn(),
      findLastBudgetHistory: vi.fn(),
      update: vi.fn(),
    } as unknown as IBudgetHistoryRepository;

    const service = new BudgetService(userRepository, budgetHistoryRepository);
    const userID = new UserID("user-123");

    await expect(service.getCurrentUserBudget(userID)).rejects.toEqual(
      expect.objectContaining({
        name: "NotFoundError",
        message: "User with id user-123 not found",
      }),
    );

    expect(userRepository.findById).toHaveBeenCalledWith("user-123");
  });
});
