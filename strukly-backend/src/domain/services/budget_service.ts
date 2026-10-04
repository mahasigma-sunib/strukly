import BudgetHistory from "../entities/budget_history";
import NotFoundError from "../errors/NotFoundError";
import IBudgetHistoryRepository from "../repositories/budget_history_repository";
import UserRepository from "../repositories/user_repository";
import UserID from "../values/user_id";

export type BudgetScope = {
  readonly users: UserRepository;
  readonly budgetHistories: IBudgetHistoryRepository;
};

export default class BudgetService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly budgetHistoryRepository: IBudgetHistoryRepository,
  ) {}

  private scopeOf(scope?: BudgetScope): BudgetScope {
    return (
      scope ?? {
        users: this.userRepository,
        budgetHistories: this.budgetHistoryRepository,
      }
    );
  }

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
  async getCurrentUserBudget(
    userID: UserID,
    scope?: BudgetScope,
  ): Promise<BudgetHistory> {
    const { users, budgetHistories } = this.scopeOf(scope);

    const user = await users.findById(userID.value);

    if (!user) {
      throw new NotFoundError(`User with id ${userID.value} not found`);
    }

    const now = new Date();
    const monthNow = now.getUTCMonth() + 1;
    const yearNow = now.getUTCFullYear();

    let lastBudgetHistory = await budgetHistories.findLastBudgetHistory(userID);

    if (
      !lastBudgetHistory ||
      lastBudgetHistory.month !== monthNow ||
      lastBudgetHistory.year !== yearNow
    ) {
      const newBudgetHistory = BudgetHistory.new({
        userID: userID,
        month: monthNow,
        year: yearNow,
        budget: 0,
      });

      if (lastBudgetHistory) {
        newBudgetHistory.addUnusedBudget(lastBudgetHistory?.unusedBudget);
      }

      lastBudgetHistory = newBudgetHistory;

      lastBudgetHistory = await budgetHistories.create(lastBudgetHistory);
    }

    return lastBudgetHistory;
  }

  async updateCurrentUserBudget(
    userID: UserID,
    newBudget: number,
    scope?: BudgetScope,
  ): Promise<void> {
    const resolved = this.scopeOf(scope);

    // getCurrentUserBudget already checks if user exists
    // no need to check again
    const lastBudgetHistory = await this.getCurrentUserBudget(userID, resolved);

    lastBudgetHistory.updateBudget(newBudget);

    await resolved.budgetHistories.update(lastBudgetHistory);
  }

  async useBudget(userID: UserID, amount: number, scope?: BudgetScope) {
    const resolved = this.scopeOf(scope);

    // getCurrentUserBudget already checks if user exists
    // no need to check again
    const budget = await this.getCurrentUserBudget(userID, resolved);
    budget.use(amount);
    await resolved.budgetHistories.update(budget);
  }
}
