import { PrismaClient } from "@prisma/client";
import RegisterUserUseCase from "./application/use_cases/register_user";
import UpdateUserProfileUseCase from "./application/use_cases/update_user";
import LoginUserUseCase from "./application/use_cases/user_login";
import PrismaBudgetHistoryRepository from "./infrastructure/repositories/prisma_budget_history_repository";
import PrismaUserRepository from "./infrastructure/repositories/prisma_user_repository";
import BcryptService from "./infrastructure/services/bcrypt_service";
import JwtService from "./infrastructure/services/jwt_service";
import PrismaGoalItemRepository from "./infrastructure/repositories/prisma_goal_item_repository";
import BudgetService from "./domain/services/budget_service";
import CreateGoalItemUseCase from "./application/use_cases/goal_item/create_goal_item";
import GetGoalItemListUseCase from "./application/use_cases/goal_item/get_goal_item_list";
import GetGoalItemUseCase from "./application/use_cases/goal_item/get_goal_item";
import DepositGoalItemUseCase from "./application/use_cases/goal_item/deposit_goal_item";
import MarkGoalItemCompletedUseCase from "./application/use_cases/goal_item/mark_goal_item_completed";
import UpdateGoalItemUseCase from "./application/use_cases/goal_item/update_goal_item";
import DeleteGoalItemUseCase from "./application/use_cases/goal_item/delete_goal_item";
import PrismaExpenseRepository from "./infrastructure/repositories/prisma_expense_repository";
import ExpenseService from "./domain/services/expense_service";
import GeminiLanguageModel from "./infrastructure/language_model/gemini_language_model";
import CreateExpenseUseCase from "./application/use_cases/expense/create_expense";
import GetMonthlyExpenseListUseCase from "./application/use_cases/expense/get_monthly_expense_list";
import GetWeeklyExpenseReportUseCase from "./application/use_cases/expense/get_weekly_expense_list";
import GetExpenseDetailUseCase from "./application/use_cases/expense/get_expense_detail";
import UpdateExpenseUseCase from "./application/use_cases/expense/update_expense";
import DeleteExpenseUseCase from "./application/use_cases/expense/delete_expense";
import ScanExpenseImageUseCase from "./application/use_cases/expense/scan_expense_image";
import GetCurrentBudgetUseCase from "./application/use_cases/budget/get_current_budget";
import UpdateCurrentBudgetUseCase from "./application/use_cases/budget/update_current_budget";

// DB Client
const prismaClient = new PrismaClient();

// Repositories
export const userRepository = new PrismaUserRepository(prismaClient);
export const goalItemRepository = new PrismaGoalItemRepository(prismaClient);
export const budgetHistoryRepository = new PrismaBudgetHistoryRepository(prismaClient);
export const expenseRepository = new PrismaExpenseRepository(prismaClient);

// Services
export const hashingService = new BcryptService();
export const tokenService = new JwtService();
export const budgetService = new BudgetService(userRepository, budgetHistoryRepository);
export const expenseService = new ExpenseService(expenseRepository);
export const languageModelService = new GeminiLanguageModel();

// UseCases
// auth
export const registerUserUseCase = new RegisterUserUseCase(userRepository, hashingService);
export const loginUserUseCase = new LoginUserUseCase(userRepository, hashingService);
export const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);

// goal
export const createGoalItemUseCase = new CreateGoalItemUseCase(goalItemRepository);
export const getGoalItemListUseCase = new GetGoalItemListUseCase(goalItemRepository);
export const getGoalItemUseCase = new GetGoalItemUseCase(goalItemRepository);
export const depositGoalItemUseCase = new DepositGoalItemUseCase(budgetService, goalItemRepository);
export const markGoalItemCompletedUseCase = new MarkGoalItemCompletedUseCase(goalItemRepository);
export const updateGoalItemUseCase = new UpdateGoalItemUseCase(goalItemRepository);
export const deleteGoalItemUseCase = new DeleteGoalItemUseCase(goalItemRepository);

// expense
export const createExpenseUseCase = new CreateExpenseUseCase(
  expenseService
);
export const getExpenseListUseCase = new GetMonthlyExpenseListUseCase(
  expenseService
);
export const getWeeklyExpenseReportUseCase = new GetWeeklyExpenseReportUseCase(
  expenseService
);
export const getExpenseDetailUseCase = new GetExpenseDetailUseCase(
  expenseService
);
export const updateExpenseUseCase = new UpdateExpenseUseCase(
  expenseService
);
export const deleteExpenseUseCase = new DeleteExpenseUseCase(
  expenseService
);
export const imageToExpenseUseCase = new ScanExpenseImageUseCase(
  languageModelService
);

// budget
export const getCurrentBudgetUseCase = new GetCurrentBudgetUseCase(budgetService);
export const updateCurrentBudgetUseCase = new UpdateCurrentBudgetUseCase(
  budgetService,
);
