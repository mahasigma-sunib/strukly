import UserID from "../values/user_id";

type BudgetHistoryBuilder = {
  userID: UserID;
  month: number;
  year: number;
  budget: number;
};

export default class BudgetHistory {
  constructor(
    public readonly userID: UserID,
    public readonly month: number,
    public readonly year: number,
    public budget: number, // must be positive
    public unusedBudget: number, // may go negative
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static new(builder: BudgetHistoryBuilder) {
    return new BudgetHistory(
      builder.userID,
      builder.month,
      builder.year,
      builder.budget,
      builder.budget,
      new Date(),
      new Date(),
    );
  }

  updateBudget(newBudget: number) {
    const deltaBudget = newBudget - this.budget;
    this.budget = newBudget;
    this.unusedBudget += deltaBudget;
    this.updatedAt = new Date();
  }

  use(amount: number) {
    this.unusedBudget -= amount;
  }

  public addUnusedBudget(amount: number) {
    this.unusedBudget += amount;
    this.updatedAt = new Date();
  }
}
