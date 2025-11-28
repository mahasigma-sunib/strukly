// src/infrastructure/controllers/goal_item_controllers.ts

import { Request, Response } from "express";
import CreateGoalItemUseCase from "src/application/use_cases/goal_item/create_goal_item";
import GetGoalItemUseCase from "src/application/use_cases/goal_item/get_goal_item";
import UpdateGoalItemUseCase from "src/application/use_cases/goal_item/update_goal_item";
import DeleteGoalItemUseCase from "src/application/use_cases/goal_item/delete_goal_item";
import GoalItemID from "src/domain/values/goal_item_id";
import NotFoundError from "src/domain/errors/NotFoundError";
import AlreadyExistError from "src/domain/errors/AlreadyExistError";
import UnauthorizedError from "src/domain/errors/UnauthorizedError";
import GetGoalItemListUseCase from "src/application/use_cases/goal_item/get_goal_item_list";
import { goalItemToDTO } from "../dto/goal_item_dto";

export default class GoalItemController {
  constructor(
    private readonly createGoalItemUseCase: CreateGoalItemUseCase,
    private readonly getGoalItemListUseCase: GetGoalItemListUseCase,
    private readonly getGoalItemUseCase: GetGoalItemUseCase,
    private readonly updateGoalItemUseCase: UpdateGoalItemUseCase,
    private readonly deleteGoalItemUseCase: DeleteGoalItemUseCase,
  ) {}

  public createGoalItem = async (
    req: Request<{}, {}, { name: string; price: number }>,
    res: Response,
  ): Promise<Response> => {
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
        .json({ message: "Goal Item created", goal: goalItemToDTO(created) });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      }

      // TODO: replace with middleware
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof AlreadyExistError) {
        return res.status(409).json({ error: error.message });
      } else if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  };

  public getGoalItemList = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const userID = req.user!.id;

      const goalItems = await this.getGoalItemListUseCase.execute(userID);

      return res.status(200).json({
        goalItems: goalItems.map((goalItem) => goalItemToDTO(goalItem)),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      }

      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof AlreadyExistError) {
        return res.status(409).json({ error: error.message });
      } else if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  };

  public getGoalItem = async (
    req: Request<{ goalItemID: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const { goalItemID } = req.params;

      const goal = await this.getGoalItemUseCase.execute(
        new GoalItemID(goalItemID),
      );

      if (!goal) return res.status(404).json({ error: "Goal Item not found" });

      return res.status(200).json({ goal: goalItemToDTO(goal) });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      }

      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof AlreadyExistError) {
        return res.status(409).json({ error: error.message });
      } else if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  };

  public updateGoalItem = async (
    req: Request<{ goalItemID: string }, {}, { name?: string; price?: number }>,
    res: Response,
  ): Promise<Response> => {
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
        .json({ message: "GoalItem updated", goal: goalItemToDTO(updated) });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      }

      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof AlreadyExistError) {
        return res.status(409).json({ error: error.message });
      } else if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  };

  public deleteGoalItem = async (
    req: Request<{ goalItemID: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const { goalItemID } = req.params;

      await this.deleteGoalItemUseCase.execute(goalItemID, userID);

      return res.status(200).json({ message: "Goal Item deleted" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      }

      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof AlreadyExistError) {
        return res.status(409).json({ error: error.message });
      } else if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
