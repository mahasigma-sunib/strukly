import { Request, Response } from "express";
import { CreateGoalItemDTO, toGoalItemDTO } from "../dto/goal_item_dto";
import CreateGoalItemUseCase from "src/application/use_cases/goal_item/create_goal_item";

export default class GoalItemController {
    constructor(private readonly createGoalItemUseCase: CreateGoalItemUseCase) { }

    public createGoalItem = async (req: Request<{}, {}, CreateGoalItemDTO>, res: Response) => {
        const userID = req.user!.id;
        const goalItem = req.body;

        try {
            const result = await this.createGoalItemUseCase.execute({
                userID,
                ...goalItem
            });
            res.status(201).json(toGoalItemDTO(result));
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "Internal server error" });
        }
    }
}