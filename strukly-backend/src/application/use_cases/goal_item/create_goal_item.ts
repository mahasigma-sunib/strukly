import { IGoalItemBuilder } from "src/domain/entities/goal_item";
import GoalService from "src/domain/services/goal_service";

export default class CreateGoalItemUseCase {
    constructor(private readonly goalService: GoalService) { }

    public async execute(builder: IGoalItemBuilder) {
        return this.goalService.createGoalItem(builder);
    }
}