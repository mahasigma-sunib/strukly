
import CreateExpenseUseCase from "../application/use_cases/expense/create_expense";
import UpdateExpenseUseCase from "../application/use_cases/expense/update_expense";
import DeleteExpenseUseCase from "../application/use_cases/expense/delete_expense";
import ExpenseService from "../domain/services/expense_service";
import BudgetService from "../domain/services/budget_service";
import UserID from "../domain/values/user_id";
import ExpenseID from "../domain/values/expense_id";
import Money from "../domain/values/money";
import { CreateExpenseRequest, UpdateExpenseRequest } from "../infrastructure/schemas";
import ExpenseCategory from "../domain/values/expense_category";
import ExpenseHeader from "../domain/entities/expense_header";
import Expense from "../domain/aggregates/expense";
import BudgetHistory from "../domain/entities/budget_history";

// Mock Services
jest.mock("../domain/services/expense_service");
jest.mock("../domain/services/budget_service");

describe("Expense Budget Flow", () => {
  let createExpenseUseCase: CreateExpenseUseCase;
  let updateExpenseUseCase: UpdateExpenseUseCase;
  let deleteExpenseUseCase: DeleteExpenseUseCase;
  let mockExpenseService: jest.Mocked<ExpenseService>;
  let mockBudgetService: jest.Mocked<BudgetService>;

  const userID = "user-123";
  const expenseID = "expense-123";
  
  // Date setup
  const now = new Date();
  const currentMonth = now.getUTCMonth() + 1;
  const currentYear = now.getUTCFullYear();
  
  // Create a previous month date
  const prevMonthDate = new Date(now);
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);


  beforeEach(() => {
    mockExpenseService = new ExpenseService({} as any) as any;
    mockBudgetService = new BudgetService({} as any, {} as any) as any;

    createExpenseUseCase = new CreateExpenseUseCase(mockExpenseService, mockBudgetService);
    updateExpenseUseCase = new UpdateExpenseUseCase(mockExpenseService, mockBudgetService);
    deleteExpenseUseCase = new DeleteExpenseUseCase(mockExpenseService, mockBudgetService);
  });

  const validExpenseRequest: CreateExpenseRequest = {
    vendorName: "Test Vendor",
    category: "food",
    dateTime: now.toISOString(),
    items: [],
    subtotalAmount: { amount: 100, currency: "IDR" },
    taxAmount: { amount: 0, currency: "IDR" },
    discountAmount: { amount: 0, currency: "IDR" },
    serviceAmount: { amount: 0, currency: "IDR" },
  };

    const createMockExpense = (amount: number, date: Date) => {
        const header = new ExpenseHeader({
            id: new ExpenseID(expenseID),
            userID: new UserID(userID),
            vendorName: "Test",
            category: ExpenseCategory.fromString("food"),
            dateTime: date,
            subtotalAmount: new Money(amount, "IDR"),
            taxAmount: new Money(0, "IDR"),
            discountAmount: new Money(0, "IDR"),
            serviceAmount: new Money(0, "IDR"),
            totalAmount: new Money(amount, "IDR"),
        });
        return new Expense(header, []);
    };
    
    const mockBudgetHistory = {
        month: currentMonth,
        year: currentYear
    } as BudgetHistory;

  describe("Create Expense", () => {
    it("should create expense and use budget", async () => {
      const mockResultExpense = createMockExpense(100, now);
      mockExpenseService.createExpense.mockResolvedValue(mockResultExpense);

      await createExpenseUseCase.execute(userID, validExpenseRequest);

      expect(mockExpenseService.createExpense).toHaveBeenCalled();
      expect(mockBudgetService.useBudget).toHaveBeenCalledWith(
        expect.any(UserID),
        100
      );
    });
  });

  describe("Update Expense", () => {
      it("should update expense and adjust budget with delta (increase)", async () => {
          const oldExpense = createMockExpense(100, now);
          const updatedExpense = createMockExpense(150, now); // Increased by 50

          mockExpenseService.getExpenseByID.mockResolvedValue(oldExpense);
          mockBudgetService.getCurrentUserBudget.mockResolvedValue(mockBudgetHistory);
          mockExpenseService.updateExpense.mockResolvedValue(updatedExpense);
          
          const updateRequest: UpdateExpenseRequest = {
              ...validExpenseRequest,
              subtotalAmount: { amount: 150, currency: "IDR" }
          };

          await updateExpenseUseCase.execute(userID, expenseID, updateRequest);
          
          expect(mockBudgetService.useBudget).toHaveBeenCalledWith(
              expect.any(UserID),
              50 // Delta 150 - 100
          );
      });

      it("should update expense and adjust budget with delta (decrease)", async () => {
          const oldExpense = createMockExpense(100, now);
          const updatedExpense = createMockExpense(80, now); // Decreased by 20

          mockExpenseService.getExpenseByID.mockResolvedValue(oldExpense);
          mockBudgetService.getCurrentUserBudget.mockResolvedValue(mockBudgetHistory);
          mockExpenseService.updateExpense.mockResolvedValue(updatedExpense);

          const updateRequest: UpdateExpenseRequest = {
              ...validExpenseRequest,
              subtotalAmount: { amount: 80, currency: "IDR" }
          };

          await updateExpenseUseCase.execute(userID, expenseID, updateRequest);

          expect(mockBudgetService.useBudget).toHaveBeenCalledWith(
              expect.any(UserID),
              -20 // Delta 80 - 100
          );
      });
      
      it("should throw error if updating expense from previous month", async () => {
          const oldExpense = createMockExpense(100, prevMonthDate);
          mockExpenseService.getExpenseByID.mockResolvedValue(oldExpense);
          mockBudgetService.getCurrentUserBudget.mockResolvedValue(mockBudgetHistory);

          await expect(updateExpenseUseCase.execute(userID, expenseID, validExpenseRequest as any))
            .rejects
            .toThrow("Cannot update expense from a previous budget period");
            
          expect(mockExpenseService.updateExpense).not.toHaveBeenCalled();
      });
  });

  describe("Delete Expense", () => {
      it("should delete expense and refund budget", async () => {
          const expense = createMockExpense(100, now);
          mockExpenseService.getExpenseByID.mockResolvedValue(expense);
          mockBudgetService.getCurrentUserBudget.mockResolvedValue(mockBudgetHistory);

          await deleteExpenseUseCase.execute(userID, expenseID);

          expect(mockExpenseService.deleteExpenseByID).toHaveBeenCalled();
          expect(mockBudgetService.useBudget).toHaveBeenCalledWith(
              expect.any(UserID),
              -100 // Refund
          );
      });
      
      it("should throw error if deleting expense from previous month", async () => {
          const expense = createMockExpense(100, prevMonthDate);
          mockExpenseService.getExpenseByID.mockResolvedValue(expense);
          mockBudgetService.getCurrentUserBudget.mockResolvedValue(mockBudgetHistory);

          await expect(deleteExpenseUseCase.execute(userID, expenseID))
            .rejects
            .toThrow("Cannot delete expense from a previous budget period");

          expect(mockExpenseService.deleteExpenseByID).not.toHaveBeenCalled();
      });
  });
});
