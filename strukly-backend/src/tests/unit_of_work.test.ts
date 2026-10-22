import { describe, it, expect, vi } from "vitest";
import { PrismaClient } from "src/generated/prisma/client";
import PrismaUnitOfWork from "../infrastructure/repositories/prisma_unit_of_work";
import InMemoryUnitOfWork, {
  InMemoryGoalItemRepository,
  createInMemoryStore,
} from "./fakes/in_memory_unit_of_work";
import User from "../domain/aggregates/user";
import GoalItem from "../domain/entities/goal_item";
import ExpenseID from "../domain/values/expense_id";
import GoalItemID from "../domain/values/goal_item_id";
import UserID from "../domain/values/user_id";
import ExpenseCategory from "../domain/values/expense_category";

function createDelegate() {
  return {
    findUnique: vi.fn().mockResolvedValue(null),
    findFirst: vi.fn().mockResolvedValue(null),
    findMany: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  };
}

function createModelClients() {
  return {
    user: createDelegate(),
    goalItem: createDelegate(),
    budgetHistory: createDelegate(),
    expenseHeader: createDelegate(),
    expenseItem: createDelegate(),
  };
}

function createPrismaStub() {
  const events: string[] = [];
  const tx = createModelClients();
  const root = createModelClients();
  const $transaction = vi.fn(async (fn: (client: object) => Promise<unknown>) => {
    events.push("begin");
    try {
      const result = await fn(tx);
      events.push("commit");
      return result;
    } catch (error) {
      events.push("rollback");
      throw error;
    }
  });
  const prisma = { ...root, $transaction } as unknown as PrismaClient;
  return { prisma, root, tx, events, $transaction };
}

describe("PrismaUnitOfWork", () => {
  it("commits on success through prisma $transaction", async () => {
    const { prisma, events } = createPrismaStub();
    const uow = new PrismaUnitOfWork(prisma);

    const result = await uow.execute(async () => "done");

    expect(result).toBe("done");
    expect(events).toEqual(["begin", "commit"]);
  });

  it("rolls back on throw and propagates the error", async () => {
    const { prisma, events } = createPrismaStub();
    const uow = new PrismaUnitOfWork(prisma);

    await expect(
      uow.execute(async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    expect(events).toEqual(["begin", "rollback"]);
  });

  it("binds the repositories to the transaction client", async () => {
    const { prisma, root, tx } = createPrismaStub();
    const uow = new PrismaUnitOfWork(prisma);

    await uow.execute(async (scope) => {
      await scope.expenses.findByID(new ExpenseID("expense-1"));
      await scope.goalItems.findByID(new GoalItemID("goal-1"));
      await scope.budgetHistories.findLastBudgetHistory(new UserID("user-1"));
      await scope.users.findById("user-1");
    });

    expect(tx.expenseHeader.findUnique).toHaveBeenCalledTimes(1);
    expect(tx.goalItem.findUnique).toHaveBeenCalledTimes(1);
    expect(tx.budgetHistory.findFirst).toHaveBeenCalledTimes(1);
    expect(tx.user.findUnique).toHaveBeenCalledTimes(1);
    expect(root.expenseHeader.findUnique).not.toHaveBeenCalled();
    expect(root.goalItem.findUnique).not.toHaveBeenCalled();
    expect(root.budgetHistory.findFirst).not.toHaveBeenCalled();
    expect(root.user.findUnique).not.toHaveBeenCalled();
  });

  it("joins the ongoing transaction for nested execute calls", async () => {
    const { prisma, events, $transaction } = createPrismaStub();
    const uow = new PrismaUnitOfWork(prisma);

    const seen: string[] = [];
    await uow.execute(async (outer) => {
      await outer.execute(async (inner) => {
        seen.push(inner === outer ? "joined" : "detached");
      });
      seen.push("outer-done");
    });

    expect(seen).toEqual(["joined", "outer-done"]);
    expect($transaction).toHaveBeenCalledTimes(1);
    expect(events).toEqual(["begin", "commit"]);
  });
});

describe("InMemoryUnitOfWork", () => {
  const makeUser = (id: string) =>
    new User({
      id,
      email: `${id}@example.com`,
      name: id,
      hashedPassword: "hash",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  it("keeps writes after a successful execute", async () => {
    const uow = new InMemoryUnitOfWork();

    await uow.execute(async (tx) => {
      await tx.users.create(makeUser("user-1"));
    });

    expect(await uow.users.findById("user-1")).not.toBeNull();
  });

  it("restores previous state when the work throws", async () => {
    const uow = new InMemoryUnitOfWork();
    await uow.users.create(makeUser("user-1"));

    await expect(
      uow.execute(async (tx) => {
        await tx.users.create(makeUser("user-2"));
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    expect(await uow.users.findById("user-2")).toBeNull();
    expect((await uow.users.findById("user-1"))?.email).toBe(
      "user-1@example.com",
    );
  });

  it("rolls back writes of joined nested execute calls", async () => {
    const uow = new InMemoryUnitOfWork();

    await expect(
      uow.execute(async (tx) => {
        await tx.execute(async (inner) => {
          await inner.users.create(makeUser("user-1"));
        });
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    expect(await uow.users.findById("user-1")).toBeNull();
  });

  it("rolls back a goal item update written before the failure", async () => {
    const store = createInMemoryStore();
    const uow = new InMemoryUnitOfWork(store);
    const goalItems = uow.goalItems as InMemoryGoalItemRepository;

    const goal = await uow.goalItems.create(
      new GoalItem(
        new GoalItemID("goal-1"),
        "Laptop",
        10000,
        0,
        false,
        null,
        new Date(),
        new Date(),
        new UserID("user-1"),
        ExpenseCategory.fromString("shopping"),
      ),
    );

    goal.deposit(2500);
    goalItems.failNextUpdateError = new Error("disk on fire");

    await expect(
      uow.execute(async (tx) => {
        await tx.goalItems.update(goal);
      }),
    ).rejects.toThrow("disk on fire");

    expect(
      (await uow.goalItems.findByID(new GoalItemID("goal-1")))?.deposited,
    ).toBe(0);
  });
});
