// src/infrastructure/controllers/goal_item_controllers.ts

import { Request, Response } from "express";
import CreateGoalItemUseCase from "src/application/use_cases/goal_item/create_goal_item";
import GetGoalItemUseCase from "src/application/use_cases/goal_item/get_goal_item";
import UpdateGoalItemUseCase from "src/application/use_cases/goal_item/update_goal_item";
import DeleteGoalItemUseCase from "src/application/use_cases/goal_item/delete_goal_item";
import GoalItemID from "src/domain/values/goal_item_id";

export default class GoalItemController {
  constructor(
    private readonly createGoalItemUseCase: CreateGoalItemUseCase,
    private readonly getGoalItemUseCase: GetGoalItemUseCase,
    private readonly updateGoalItemUseCase: UpdateGoalItemUseCase,
    private readonly deleteGoalItemUseCase: DeleteGoalItemUseCase,
  ) {}

  public createGoalItem = async (req: Request<{}, {}, { name: string; price: number }>, res: Response): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const { name, price } = req.body;

      const created = await this.createGoalItemUseCase.execute(userID, name, price);

      return res.status(201).json({ message: 'GoalItem created', goal: created.toDTO() });
    } catch (error: unknown) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getGoalItem = async (req: Request<{ goalItemID: string }>, res: Response): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const { goalItemID } = req.params;

      const goal = await this.getGoalItemUseCase.execute(new GoalItemID(goalItemID));

      if (!goal) return res.status(404).json({ error: 'GoalItem not found' });

      return res.status(200).json({ goal: goal.toDTO() });
    } catch (error: unknown) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  public updateGoalItem = async (req: Request<{ goalItemID: string }, {}, { name?: string; price?: number }>, res: Response): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const { goalItemID } = req.params;
      const data = req.body;

      const updated = await this.updateGoalItemUseCase.execute(userID, goalItemID, data);

      return res.status(200).json({ message: 'GoalItem updated', goal: updated.toDTO() });
    } catch (error: unknown) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  public deleteGoalItem = async (req: Request<{ goalItemID: string }>, res: Response): Promise<Response> => {
    try {
      const userID = req.user!.id;
      const { goalItemID } = req.params;

      await this.deleteGoalItemUseCase.execute(goalItemID, userID);

      return res.status(200).json({ message: 'GoalItem deleted' });
    } catch (error: unknown) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
