import BudgetHistory from "../entities/budget_history";
import NotFoundError from "../errors/NotFoundError";
import IBudgetHistoryRepository from "../repositories/budget_history_repository";
import UserRepository from "../repositories/user_repository";
import UserID from "../values/user_id";

export default class BudgetService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly budgetHistoryRepository: IBudgetHistoryRepository,
  ) {}

  // TODO: use UserID type
  /**
   * Selects the current month and year budget for user with userID.
   * Checks if the user exists.
   * If it doesn't exist it will create one.
   *
   * It works this way:
   * 1. First it gets the last budget history.
   * 2. If it doesn't exist it will create one.
   * 3. If it exists but is from a different month or year, it will create a new one with unusedBudget carrying over.
   * 4. If it exists but is from the same month and year, it will return the existing budget history.
   * @param userID
   * @returns userID's budget history for current month and year
   */
  async getCurrentUserBudget(userID: string): Promise<BudgetHistory> {
    const userIDValue = new UserID(userID);
    const user = await this.userRepository.findById(userID);

    if (!user) {
      throw new NotFoundError(`User with id ${userID} not found`);
    }

    const now = new Date();
    const monthNow = now.getUTCMonth() + 1;
    const yearNow = now.getUTCFullYear();

    let lastBudgetHistory =
      await this.budgetHistoryRepository.findLastBudgetHistory(userIDValue);

    if (
      !lastBudgetHistory ||
      lastBudgetHistory.month !== monthNow ||
      lastBudgetHistory.year !== yearNow
    ) {
      const newBudgetHistory = BudgetHistory.new({
        userID: userIDValue,
        month: monthNow,
        year: yearNow,
        budget: 0,
      });

      if (lastBudgetHistory) {
        newBudgetHistory.addUnusedBudget(lastBudgetHistory?.unusedBudget);
      }

      lastBudgetHistory = newBudgetHistory;

      lastBudgetHistory =
        await this.budgetHistoryRepository.create(lastBudgetHistory);
    }

    return lastBudgetHistory;
  }

  async updateCurrentUserBudget(
    userID: string,
    newBudget: number,
  ): Promise<void> {
    // getCurrentUserBudget already checks if user exists
    // no need to check again
    const lastBudgetHistory = await this.getCurrentUserBudget(userID);

    lastBudgetHistory.updateBudget(newBudget);

    await this.budgetHistoryRepository.update(lastBudgetHistory);
  }

  async useBudget(userID: UserID, amount: number) {
    // getCurrentUserBudget already checks if user exists
    // no need to check again
    const budget = await this.getCurrentUserBudget(userID.value);
    budget.use(amount);
    await this.budgetHistoryRepository.update(budget);
  }
}
