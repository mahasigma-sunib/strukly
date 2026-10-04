import IBudgetHistoryRepository from "./budget_history_repository";
import IExpenseRepository from "./expense_repository";
import { IGoalItemRepository } from "./goal_item_repository";
import UserRepository from "./user_repository";

/**
 * Transactional scope over the repositories. `execute` runs `fn` atomically:
 * commit on resolve, rollback on throw. Calling `execute` on a scope that is
 * already transactional joins the ongoing transaction instead of opening one.
 */
export default interface IUnitOfWork {
  readonly expenses: IExpenseRepository;
  readonly goalItems: IGoalItemRepository;
  readonly budgetHistories: IBudgetHistoryRepository;
  readonly users: UserRepository;
  execute<T>(fn: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
