// src/domain/entities/goal_item.ts

import InvalidDataError from "../errors/InvalidDataError";
import GoalItemID from "../values/goal_item_id";
import UserID from "../values/user_id";

export interface IGoalItemBuilder {
  userID: string;
  name: string;
  price: number;
}

export interface IGoalItemEditor {
  name: string;
  price: number;
}

export default class GoalItem {
  constructor(
    public id: GoalItemID,

    public name: string,
    public price: number,
    public deposited: number,
    public completed: boolean,
    public completedAt: Date | null,

    public createdAt: Date,
    public updatedAt: Date,

    public userID: UserID,
  ) {}

  static new(builder: IGoalItemBuilder) {
    return new GoalItem(
      GoalItemID.fromRandom(),
      builder.name,
      builder.price,
      0,
      false,
      new Date(),
      new Date(),
      new Date(),
      new UserID(builder.userID),
    );
  }

  public update(editor: Partial<IGoalItemEditor>) {
    if (editor.name !== undefined) {
      this.name = editor.name;
    }
    if (editor.price !== undefined) {
      if (editor.price < 0) {
        throw new InvalidDataError("Goal Item Price must be positive");
      }
      if (editor.price < this.deposited) {
        throw new InvalidDataError(
          "Goal Item New Price cannot be lower than deposited amount",
        );
      }
      this.price = editor.price;
    }
    this.updatedAt = new Date();
  }

  deposit(amount: number) {
    if (amount <= 0)
      throw new InvalidDataError("Goal Item Deposit Amount must be positive");
    this.deposited += amount;
    this.updatedAt = new Date();
    if (this.deposited >= this.price && !this.completed) {
      this.completed = true;
      this.completedAt = new Date();
    }
  }

  remaining(): number {
    return Math.max(0, this.price - this.deposited);
  }
}
