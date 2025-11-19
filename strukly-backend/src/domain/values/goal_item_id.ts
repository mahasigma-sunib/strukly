export default class GoalItemID {
    constructor(public readonly value: string) { }
    static fromRandom(): GoalItemID {
        return new GoalItemID(crypto.randomUUID());
    }

    equals(other: GoalItemID): boolean {
        return this.value === other.value;
    }
}
