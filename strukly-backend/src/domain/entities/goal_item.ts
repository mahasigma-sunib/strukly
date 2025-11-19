import GoalItemID from "../values/goal_item_id";
import UserID from "../values/user_id";

export interface IGoalItemBuilder {
    userID: string;
    name: string;
    price: number;
};

export default class GoalItem {
    constructor(
        public id: GoalItemID,
        public userID: UserID,
        public name: string,
        public price: number,
        public deposited: number,
        public completed: boolean,
        public completedAt: Date,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }

    static new(builder: IGoalItemBuilder) {
        return new GoalItem(
            GoalItemID.fromRandom(),
            new UserID(builder.userID),
            builder.name,
            builder.price,
            0,
            false,
            new Date(),
            new Date(),
            new Date(),
        )
    }
}
