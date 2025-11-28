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

  async getCurrentUserBudget(userID: string): Promise<BudgetHistory> {
    const userIDValue = new UserID(userID);
    const user = await this.userRepository.findById(userID);

    if (!user) {
      throw new NotFoundError(`User with id ${userID} not found`);
    }

    const now = new Date();

    let budgetHistory = await this.budgetHistoryRepository.findByUserDate(
      userIDValue,
      now.getUTCMonth() + 1,
      now.getUTCFullYear(),
    );

    if (!budgetHistory) {
      budgetHistory = BudgetHistory.new({
        userID: userIDValue,
        month: now.getUTCMonth() + 1,
        year: now.getUTCFullYear(),
        budget: 0,
      });
      budgetHistory = await this.budgetHistoryRepository.create(budgetHistory);
    }

    return budgetHistory;
  }

  async updateCurrentUserBudget(
    userID: string,
    newBudget: number,
  ): Promise<void> {
    const userIDValue = new UserID(userID);
    const user = await this.userRepository.findById(userID);

    if (!user) {
      throw new NotFoundError(`User with id ${userID} not found`);
    }

    const now = new Date();

    let budgetHistory = await this.budgetHistoryRepository.findByUserDate(
      userIDValue,
      now.getUTCMonth() + 1,
      now.getUTCFullYear(),
    );

    if (!budgetHistory) {
      budgetHistory = BudgetHistory.new({
        userID: userIDValue,
        month: now.getUTCMonth() + 1,
        year: now.getUTCFullYear(),
        budget: newBudget,
      });
      budgetHistory = await this.budgetHistoryRepository.create(budgetHistory);
    }

    budgetHistory.updateBudget(newBudget);

    await this.budgetHistoryRepository.update(budgetHistory);
  }
}
