// src/infrastructure/controllers/goal_item_controllers.ts

import { Request, Response, NextFunction } from "express";
import CreateGoalItemUseCase from "src/application/use_cases/goal_item/create_goal_item";
import GetGoalItemUseCase from "src/application/use_cases/goal_item/get_goal_item";
import UpdateGoalItemUseCase from "src/application/use_cases/goal_item/update_goal_item";
import DeleteGoalItemUseCase from "src/application/use_cases/goal_item/delete_goal_item";
import GetGoalItemListUseCase from "src/application/use_cases/goal_item/get_goal_item_list";
import { mapGoalItemToResponse } from "../mappers";
import DepositGoalItemUseCase from "src/application/use_cases/goal_item/deposit_goal_item";
import MarkGoalItemCompletedUseCase from "src/application/use_cases/goal_item/mark_goal_item_completed";

export default class GoalItemController {
  constructor(
    private readonly createGoalItemUseCase: CreateGoalItemUseCase,
    private readonly getGoalItemListUseCase: GetGoalItemListUseCase,
    private readonly getGoalItemUseCase: GetGoalItemUseCase,
    private readonly depositGoalItemUseCase: DepositGoalItemUseCase,
    private readonly markGoalItemCompletedUseCase: MarkGoalItemCompletedUseCase,
    private readonly updateGoalItemUseCase: UpdateGoalItemUseCase,
    private readonly deleteGoalItemUseCase: DeleteGoalItemUseCase,
  ) { }

  public createGoalItem = async (
    req: Request<{}, {}, { name: string; price: number }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userID = req.user!.id;
      const { name, price } = req.body;

      const created = await this.createGoalItemUseCase.execute(
        userID,
        name,
        price,
      );

      return res
        .status(201)
        .json({ message: "Goal Item created", goal: mapGoalItemToResponse(created) });
    } catch (error) {
      next(error);
    }
  };

  public getGoalItemList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userID = req.user!.id;

      const goalItems = await this.getGoalItemListUseCase.execute(userID);

      return res.status(200).json({
        goalItems: goalItems.map((goalItem) => mapGoalItemToResponse(goalItem)),
      });
    } catch (error) {
      next(error);
    }
  };

  public getGoalItem = async (
    req: Request<{ goalItemID: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userID = req.user!.id;
      const { goalItemID } = req.params;

      const goal = await this.getGoalItemUseCase.execute(
        userID, goalItemID,
      );

      return res.status(200).json({ goal: mapGoalItemToResponse(goal) });
    } catch (error) {
      next(error);
    }
  };

  public depositGoalItem = async (
    req: Request<{ goalItemID: string }, {}, { amount: number }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userID = req.user!.id;
      const { goalItemID } = req.params;
      const { amount } = req.body;

      await this.depositGoalItemUseCase.execute(userID, goalItemID, amount);

      return res.status(200).json({ message: "Goal Item deposited" });
    } catch (error) {
      next(error);
    }
  };

  public markGoalItemCompleted = async (
    req: Request<{ goalItemID: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userID = req.user!.id;
      const { goalItemID } = req.params;

      await this.markGoalItemCompletedUseCase.execute(
        userID,
        goalItemID,
      );

      return res.status(200).json({ message: "Goal Item completed" });
    } catch (error) {
      next(error);
    }
  }

  public updateGoalItem = async (
    req: Request<{ goalItemID: string }, {}, { name?: string; price?: number }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userID = req.user!.id;
      const { goalItemID } = req.params;
      const data = req.body;

      const updated = await this.updateGoalItemUseCase.execute(
        userID,
        goalItemID,
        data,
      );

      return res
        .status(200)
        .json({ message: "GoalItem updated", goal: mapGoalItemToResponse(updated) });
    } catch (error) {
      next(error);
    }
  };

  public deleteGoalItem = async (
    req: Request<{ goalItemID: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userID = req.user!.id;
      const { goalItemID } = req.params;

      await this.deleteGoalItemUseCase.execute(goalItemID, userID);

      return res.status(200).json({ message: "Goal Item deleted" });
    } catch (error) {
      next(error);
    }
  };
}
