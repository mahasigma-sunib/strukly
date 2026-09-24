import Expense from "src/domain/aggregates/expense";
import User from "src/domain/aggregates/user";
import BudgetHistory from "src/domain/entities/budget_history";
import ExpenseHeader from "src/domain/entities/expense_header";
import ExpenseItem from "src/domain/entities/expense_item";
import GoalItem from "src/domain/entities/goal_item";
import IBudgetHistoryRepository from "src/domain/repositories/budget_history_repository";
import IExpenseRepository from "src/domain/repositories/expense_repository";
import { IGoalItemRepository } from "src/domain/repositories/goal_item_repository";
import UserRepository from "src/domain/repositories/user_repository";
import IUnitOfWork from "src/domain/repositories/unit_of_work";
import ExpenseCategory from "src/domain/values/expense_category";
import ExpenseID from "src/domain/values/expense_id";
import ExpenseItemID from "src/domain/values/expense_item_id";
import GoalItemID from "src/domain/values/goal_item_id";
import Money from "src/domain/values/money";
import UserID from "src/domain/values/user_id";

type UserRow = {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
};

type GoalItemRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  deposited: number;
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userID: string;
};

type BudgetHistoryRow = {
  userID: string;
  month: number;
  year: number;
  budget: number;
  unusedBudget: number;
  createdAt: Date;
  updatedAt: Date;
};

type ExpenseItemRow = {
  id: string;
  expenseID: string;
  name: string;
  quantity: number;
  singlePrice: number;
  totalPrice: number;
};

type ExpenseRow = {
  id: string;
  userID: string;
  dateTime: Date;
  vendorName: string;
  category: string;
  subtotalAmount: number;
  taxAmount: number;
  discountAmount: number;
  serviceAmount: number;
  totalAmount: number;
  items: ExpenseItemRow[];
};

export type InMemoryStore = {
  users: Map<string, UserRow>;
  goalItems: Map<string, GoalItemRow>;
  budgetHistories: Map<string, BudgetHistoryRow>;
  expenses: Map<string, ExpenseRow>;
};

export function createInMemoryStore(): InMemoryStore {
  return {
    users: new Map(),
    goalItems: new Map(),
    budgetHistories: new Map(),
    expenses: new Map(),
  };
}

function toUser(row: UserRow): User {
  return new User({
    id: row.id,
    email: row.email,
    name: row.name,
    hashedPassword: row.hashedPassword,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

function toGoalItem(row: GoalItemRow): GoalItem {
  return new GoalItem(
    new GoalItemID(row.id),
    row.name,
    row.price,
    row.deposited,
    row.completed,
    row.completedAt,
    row.createdAt,
    row.updatedAt,
    new UserID(row.userID),
    ExpenseCategory.fromString(row.category),
  );
}

function toBudgetHistory(row: BudgetHistoryRow): BudgetHistory {
  return new BudgetHistory(
    new UserID(row.userID),
    row.month,
    row.year,
    row.budget,
    row.unusedBudget,
    row.createdAt,
    row.updatedAt,
  );
}

function toExpense(row: ExpenseRow): Expense {
  return new Expense(
    new ExpenseHeader({
      id: new ExpenseID(row.id),
      dateTime: row.dateTime,
      vendorName: row.vendorName,
      category: ExpenseCategory.fromString(row.category),
      subtotalAmount: Money.newWithDefault(row.subtotalAmount),
      taxAmount: Money.newWithDefault(row.taxAmount),
      discountAmount: Money.newWithDefault(row.discountAmount),
      serviceAmount: Money.newWithDefault(row.serviceAmount),
      totalAmount: Money.newWithDefault(row.totalAmount),
      userID: new UserID(row.userID),
    }),
    row.items.map(
      (item) =>
        new ExpenseItem({
          id: new ExpenseItemID(item.id),
          name: item.name,
          quantity: item.quantity,
          singlePrice: Money.newWithDefault(item.singlePrice),
          totalPrice: Money.newWithDefault(item.totalPrice),
          expenseID: new ExpenseID(item.expenseID),
        }),
    ),
  );
}

function toExpenseRow(expense: Expense): ExpenseRow {
  return {
    id: expense.header.id.value,
    userID: expense.header.userID.value,
    dateTime: expense.header.dateTime,
    vendorName: expense.header.vendorName,
    category: expense.header.category.value,
    subtotalAmount: expense.header.subtotalAmount.value,
    taxAmount: expense.header.taxAmount.value,
    discountAmount: expense.header.discountAmount.value,
    serviceAmount: expense.header.serviceAmount.value,
    totalAmount: expense.header.totalAmount.value,
    items: expense.items.map((item) => ({
      id: item.id.value,
      expenseID: item.expenseID.value,
      name: item.name,
      quantity: item.quantity,
      singlePrice: item.singlePrice.value,
      totalPrice: item.totalPrice.value,
    })),
  };
}

function budgetHistoryKey(userID: string, month: number, year: number): string {
  return `${userID}_${month}_${year}`;
}

export class InMemoryUserRepository implements UserRepository {
  constructor(protected readonly store: InMemoryStore) {}

  async findByEmail(email: string): Promise<User | null> {
    const row = [...this.store.users.values()].find((r) => r.email === email);
    return row ? toUser(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = this.store.users.get(id);
    return row ? toUser(row) : null;
  }

  async create(user: User): Promise<void> {
    if (this.store.users.has(user.id)) {
      throw new Error("User already exists");
    }
    this.store.users.set(user.id, {
      id: user.id,
      email: user.email,
      name: user.name,
      hashedPassword: user.hashedPassword,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async update(user: User): Promise<void> {
    if (!this.store.users.has(user.id)) {
      throw new Error("User not found");
    }
    this.store.users.set(user.id, {
      id: user.id,
      email: user.email,
      name: user.name,
      hashedPassword: user.hashedPassword,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}

export class InMemoryGoalItemRepository implements IGoalItemRepository {
  failNextUpdateError: Error | null = null;

  constructor(protected readonly store: InMemoryStore) {}

  async create(goalItem: GoalItem): Promise<GoalItem> {
    if (this.store.goalItems.has(goalItem.id.value)) {
      throw new Error("Goal Item already exists");
    }
    const row: GoalItemRow = {
      id: goalItem.id.value,
      name: goalItem.name,
      category: goalItem.category.value,
      price: goalItem.price,
      deposited: goalItem.deposited,
      completed: goalItem.completed,
      completedAt: goalItem.completedAt,
      createdAt: goalItem.createdAt,
      updatedAt: goalItem.updatedAt,
      userID: goalItem.userID.value,
    };
    this.store.goalItems.set(row.id, row);
    return toGoalItem(row);
  }

  async findByID(goalItemID: GoalItemID): Promise<GoalItem | null> {
    const row = this.store.goalItems.get(goalItemID.value);
    return row ? toGoalItem(row) : null;
  }

  async findByUserID(userID: UserID): Promise<GoalItem[]> {
    return [...this.store.goalItems.values()]
      .filter((row) => row.userID === userID.value)
      .map(toGoalItem);
  }

  async update(goalItem: GoalItem): Promise<GoalItem> {
    const row: GoalItemRow = {
      id: goalItem.id.value,
      name: goalItem.name,
      category: goalItem.category.value,
      price: goalItem.price,
      deposited: goalItem.deposited,
      completed: goalItem.completed,
      completedAt: goalItem.completedAt,
      createdAt: goalItem.createdAt,
      updatedAt: goalItem.updatedAt,
      userID: goalItem.userID.value,
    };
    this.store.goalItems.set(row.id, row);

    if (this.failNextUpdateError) {
      const error = this.failNextUpdateError;
      this.failNextUpdateError = null;
      throw error;
    }

    return toGoalItem(row);
  }

  async delete(goalItemID: GoalItemID): Promise<void> {
    this.store.goalItems.delete(goalItemID.value);
  }
}

export class InMemoryBudgetHistoryRepository implements IBudgetHistoryRepository {
  constructor(protected readonly store: InMemoryStore) {}

  async create(budgetHistory: BudgetHistory): Promise<BudgetHistory> {
    const key = budgetHistoryKey(
      budgetHistory.userID.value,
      budgetHistory.month,
      budgetHistory.year,
    );
    if (this.store.budgetHistories.has(key)) {
      throw new Error("Budget History already exists");
    }
    const row: BudgetHistoryRow = {
      userID: budgetHistory.userID.value,
      month: budgetHistory.month,
      year: budgetHistory.year,
      budget: budgetHistory.budget,
      unusedBudget: budgetHistory.unusedBudget,
      createdAt: budgetHistory.createdAt,
      updatedAt: budgetHistory.updatedAt,
    };
    this.store.budgetHistories.set(key, row);
    return toBudgetHistory(row);
  }

  async findByUserDate(
    userID: UserID,
    month: number,
    year: number,
  ): Promise<BudgetHistory | null> {
    const row = this.store.budgetHistories.get(
      budgetHistoryKey(userID.value, month, year),
    );
    return row ? toBudgetHistory(row) : null;
  }

  async findLastBudgetHistory(userID: UserID): Promise<BudgetHistory | null> {
    const rows = [...this.store.budgetHistories.values()].filter(
      (row) => row.userID === userID.value,
    );
    rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return rows[0] ? toBudgetHistory(rows[0]) : null;
  }

  async update(budgetHistory: BudgetHistory): Promise<void> {
    const key = budgetHistoryKey(
      budgetHistory.userID.value,
      budgetHistory.month,
      budgetHistory.year,
    );
    if (!this.store.budgetHistories.has(key)) {
      throw new Error("Budget History not found");
    }
    this.store.budgetHistories.set(key, {
      userID: budgetHistory.userID.value,
      month: budgetHistory.month,
      year: budgetHistory.year,
      budget: budgetHistory.budget,
      unusedBudget: budgetHistory.unusedBudget,
      createdAt: budgetHistory.createdAt,
      updatedAt: budgetHistory.updatedAt,
    });
  }
}

export class InMemoryExpenseRepository implements IExpenseRepository {
  constructor(protected readonly store: InMemoryStore) {}

  async create(expense: Expense): Promise<Expense> {
    const row = toExpenseRow(expense);
    this.store.expenses.set(row.id, row);
    return toExpense(row);
  }

  async delete(expenseID: ExpenseID): Promise<void> {
    this.store.expenses.delete(expenseID.value);
  }

  async findByID(expenseID: ExpenseID): Promise<Expense | null> {
    const row = this.store.expenses.get(expenseID.value);
    return row ? toExpense(row) : null;
  }

  async findByDateRange(userID: UserID, from: Date, to: Date): Promise<Expense[]> {
    const startDate = new Date(from);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    return [...this.store.expenses.values()]
      .filter(
        (row) =>
          row.userID === userID.value &&
          row.dateTime >= startDate &&
          row.dateTime <= endDate,
      )
      .map(toExpense);
  }

  async update(expense: Expense): Promise<Expense> {
    const row = toExpenseRow(expense);
    this.store.expenses.set(row.id, row);
    return toExpense(row);
  }
}

type InMemoryRepos = {
  expenses: IExpenseRepository;
  goalItems: IGoalItemRepository;
  budgetHistories: IBudgetHistoryRepository;
  users: UserRepository;
};

export default class InMemoryUnitOfWork implements IUnitOfWork {
  readonly expenses: IExpenseRepository;
  readonly goalItems: IGoalItemRepository;
  readonly budgetHistories: IBudgetHistoryRepository;
  readonly users: UserRepository;

  constructor(
    readonly store: InMemoryStore = createInMemoryStore(),
    private readonly scoped = false,
    repos?: InMemoryRepos,
  ) {
    this.expenses = repos?.expenses ?? new InMemoryExpenseRepository(this.store);
    this.goalItems = repos?.goalItems ?? new InMemoryGoalItemRepository(this.store);
    this.budgetHistories =
      repos?.budgetHistories ?? new InMemoryBudgetHistoryRepository(this.store);
    this.users = repos?.users ?? new InMemoryUserRepository(this.store);
  }

  async execute<T>(fn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    if (this.scoped) {
      return fn(this);
    }

    const snapshot = structuredClone(this.store);
    try {
      return await fn(new InMemoryUnitOfWork(this.store, true, this));
    } catch (error) {
      this.store.users = snapshot.users;
      this.store.goalItems = snapshot.goalItems;
      this.store.budgetHistories = snapshot.budgetHistories;
      this.store.expenses = snapshot.expenses;
      throw error;
    }
  }
}
